'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import jsQR from 'jsqr';
import {
  AlertTriangle,
  BadgeCheck,
  Camera,
  CheckCircle2,
  DoorOpen,
  Loader2,
  LogOut,
  QrCode,
  RefreshCw,
  ShieldCheck,
  TicketCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SESSION_STORAGE_KEY = 'bouncinn_staff_session';
const DEVICE_STORAGE_KEY = 'bouncinn_staff_device_id';

let staffSupabase: SupabaseClient | null = null;

type StaffAccess = {
  id: string;
  label: string | null;
  companyId: string;
  venueId: string | null;
  eventId: string | null;
  expiresAt: string | null;
};

type StoredStaffSession = {
  sessionToken: string;
  deviceId: string;
  access: StaffAccess;
};

type LoginResponse = StoredStaffSession;

type AvailablePromotion = {
  userPromotionId: string;
  status: string;
  claimedAt: string | null;
  promotion: {
    id: string;
    title: string | null;
    description: string | null;
    noteToStaff: string | null;
    startsAt: string | null;
    endsAt: string | null;
    validUntil: string | null;
    type: string | null;
    status: string | null;
    bannerUrl: string | null;
    companyId: string | null;
    venueId: string | null;
    eventId: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  };
};

type ScannedUser = {
  id: string;
  name: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
};

type RedemptionResponse = {
  success?: boolean;
  user?: ScannedUser | null;
  promotions?: AvailablePromotion[];
  promotion?: {
    id: string;
    title: string | null;
    noteToStaff: string | null;
  };
  userPromotion?: {
    id: string;
    user_id: string;
    promotion_id: string;
    status: string;
  };
  error?: string;
};

type ParsedQrPayload = {
  userPromotionId?: string;
  userId?: string;
  promotionId?: string;
};

type RedemptionState =
  | { status: 'idle' }
  | { status: 'success'; message: string; detail?: string }
  | { status: 'error'; message: string; detail?: string };

function createDeviceId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStaffSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Staff portal Supabase config is missing.');
  }

  staffSupabase ??= createClient(supabaseUrl, supabaseAnonKey);
  return staffSupabase;
}

function getStoredDeviceId() {
  const existing = window.localStorage.getItem(DEVICE_STORAGE_KEY);
  if (existing) return existing;

  const deviceId = createDeviceId();
  window.localStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
  return deviceId;
}

function getDeviceName() {
  type NavigatorWithUserAgentData = Navigator & {
    userAgentData?: {
      platform?: string;
      mobile?: boolean;
      brands?: Array<{ brand: string; version: string }>;
    };
  };

  const userAgentData = (navigator as NavigatorWithUserAgentData).userAgentData;
  const platform = userAgentData?.platform || navigator.platform || 'Unknown device';
  const browser = userAgentData?.brands?.find((brand) => !brand.brand.toLowerCase().includes('not'))?.brand;
  const formFactor = userAgentData?.mobile || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';

  return [platform, browser, formFactor].filter(Boolean).join(' - ');
}

function readStoredSession(): StoredStaffSession | null {
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredStaffSession;
    if (!parsed.sessionToken || !parsed.deviceId || !parsed.access) return null;
    return parsed;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function mapFunctionError(message: string, status?: number) {
  const lower = message.toLowerCase();

  if (status === 401 || lower.includes('staff session')) {
    return 'Your staff session is invalid or expired. Please log in again.';
  }

  if (lower.includes('revoked')) return 'This staff access code has been revoked.';
  if (lower.includes('venue')) return 'This QR belongs to a different venue.';
  if (lower.includes('event')) return 'This QR belongs to a different event.';
  if (lower.includes('company')) return 'This QR belongs to a different company.';
  if (lower.includes('already redeemed') || lower.includes('already used')) return 'This promotion has already been redeemed.';
  if (lower.includes('expired')) return 'This promotion or access code has expired.';
  if (lower.includes('not active') || lower.includes('inactive')) return 'This promotion is inactive.';
  if (lower.includes('not started')) return 'This promotion has not started yet.';
  if (lower.includes('no redeemable promotion') || lower.includes('promotion not found')) {
    return 'No redeemable promotion was found for this QR.';
  }
  if (lower.includes('qr')) return 'Invalid QR code.';
  if (lower.includes('device limit')) return 'The active device limit has been reached for this code.';
  if (lower.includes('access code')) return 'Invalid or expired staff access code.';

  return message || 'Something went wrong. Please try again.';
}

async function getFunctionErrorDetails(error: unknown) {
  const fallbackMessage = error instanceof Error ? error.message : 'Edge Function request failed.';
  const context = error && typeof error === 'object' && 'context' in error ? (error as { context?: unknown }).context : undefined;
  const status = context instanceof Response ? context.status : undefined;

  if (context instanceof Response) {
    try {
      const body = (await context.clone().json()) as { error?: unknown; message?: unknown };
      const message = typeof body.error === 'string' ? body.error : typeof body.message === 'string' ? body.message : fallbackMessage;
      return { message, status };
    } catch {
      return { message: fallbackMessage, status };
    }
  }

  return { message: fallbackMessage, status };
}

function extractStringField(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function extractQrPayload(rawValue: string): ParsedQrPayload | null {
  const value = rawValue.trim();
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as {
      userPromotionId?: unknown;
      userId?: unknown;
      promotionId?: unknown;
      qrPayload?: {
        userPromotionId?: unknown;
        userId?: unknown;
        promotionId?: unknown;
      };
    };
    const payload = {
      userPromotionId: extractStringField(parsed.userPromotionId ?? parsed.qrPayload?.userPromotionId),
      userId: extractStringField(parsed.userId ?? parsed.qrPayload?.userId),
      promotionId: extractStringField(parsed.promotionId ?? parsed.qrPayload?.promotionId),
    };

    if (payload.userPromotionId || payload.userId || payload.promotionId) return payload;
  } catch {
    // QR codes can be plain ids or URLs, so JSON parsing is only one path.
  }

  try {
    const url = new URL(value);
    const payload = {
      userPromotionId: url.searchParams.get('userPromotionId')?.trim() || undefined,
      userId: url.searchParams.get('userId')?.trim() || undefined,
      promotionId: url.searchParams.get('promotionId')?.trim() || undefined,
    };

    if (payload.userPromotionId || payload.userId || payload.promotionId) return payload;

    const lastPathPart = url.pathname.split('/').filter(Boolean).at(-1);
    if (lastPathPart) {
      const id = decodeURIComponent(lastPathPart).trim();
      return { userPromotionId: id, userId: id };
    }
  } catch {
    // Plain QR payloads fall through.
  }

  return { userPromotionId: value, userId: value };
}

function formatExpiry(expiresAt: string | null) {
  if (!expiresAt) return 'Forever';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(expiresAt));
}

function formatOptionalDate(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function humanizeValue(value: string | null) {
  if (!value) return null;
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function StaffPortal() {
  const [session, setSession] = useState<StoredStaffSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [code, setCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [activePromotionId, setActivePromotionId] = useState('');
  const [scannedUser, setScannedUser] = useState<ScannedUser | null>(null);
  const [availablePromotions, setAvailablePromotions] = useState<AvailablePromotion[]>([]);
  const [redemptionState, setRedemptionState] = useState<RedemptionState>({ status: 'idle' });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);
  const redeemingRef = useRef(false);

  const clearSession = useCallback(() => {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
    setCode('');
    setLoginError('');
    setScannedUser(null);
    setAvailablePromotions([]);
    setRedemptionState({ status: 'idle' });
  }, []);

  const stopScanner = useCallback(() => {
    if (scanLoopRef.current) {
      window.cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScanning(false);
  }, []);

  const handleFunctionError = useCallback(
    (errorMessage: string, errorStatus?: number) => {
      const message = mapFunctionError(errorMessage, errorStatus);
      if (errorStatus === 401) clearSession();
      setRedemptionState({ status: 'error', message, detail: errorMessage });
    },
    [clearSession],
  );

  const lookupPromotions = useCallback(
    async (rawQrValue: string) => {
      if (!session || redeemingRef.current) return;
      stopScanner();

      const qrPayload = extractQrPayload(rawQrValue);
      if (!qrPayload) {
        setRedemptionState({ status: 'error', message: 'Invalid QR code.', detail: 'No promotion id was found in the QR payload.' });
        return;
      }

      redeemingRef.current = true;
      setIsRedeeming(true);
      setActivePromotionId('');
      setScannedUser(null);
      setAvailablePromotions([]);
      setRedemptionState({ status: 'idle' });

      let data: RedemptionResponse | null = null;
      let errorMessage = '';
      let errorStatus: number | undefined;

      try {
        const response = await getStaffSupabaseClient().functions.invoke<RedemptionResponse>('redeem-promotion', {
          body: {
            action: 'lookup',
            sessionToken: session.sessionToken,
            ...qrPayload,
            qrPayload,
          },
        });

        data = response.data;
        if (response.error) {
          const details = await getFunctionErrorDetails(response.error);
          errorMessage = details.message;
          errorStatus = details.status;
        }
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Unable to redeem promotion.';
      }

      setIsRedeeming(false);
      redeemingRef.current = false;

      if (errorMessage) {
        handleFunctionError(errorMessage, errorStatus);
        return;
      }

      if (data?.error) {
        handleFunctionError(data.error);
        return;
      }

      const promotions = data?.promotions || [];
      if (promotions.length === 0) {
        setRedemptionState({
          status: 'error',
          message: 'No redeemable promotion was found for this QR.',
          detail: 'The guest may not have an active promotion for this staff access scope.',
        });
        return;
      }

      setScannedUser(data?.user || null);
      setAvailablePromotions(promotions);
      setRedemptionState({
        status: 'success',
        message: `${promotions.length} promotion${promotions.length === 1 ? '' : 's'} available`,
        detail: 'Choose the exact promotion to use.',
      });
      stopScanner();
    },
    [handleFunctionError, session, stopScanner],
  );

  const redeemSelectedPromotion = useCallback(
    async (userPromotionId: string) => {
      if (!session || redeemingRef.current) return;

      redeemingRef.current = true;
      setIsRedeeming(true);
      setActivePromotionId(userPromotionId);
      setRedemptionState({ status: 'idle' });

      let data: RedemptionResponse | null = null;
      let errorMessage = '';
      let errorStatus: number | undefined;

      try {
        const response = await getStaffSupabaseClient().functions.invoke<RedemptionResponse>('redeem-promotion', {
          body: {
            action: 'redeem',
            sessionToken: session.sessionToken,
            userPromotionId,
            qrPayload: { userPromotionId },
          },
        });

        data = response.data;
        if (response.error) {
          const details = await getFunctionErrorDetails(response.error);
          errorMessage = details.message;
          errorStatus = details.status;
        }
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Unable to redeem promotion.';
      }

      setIsRedeeming(false);
      setActivePromotionId('');
      redeemingRef.current = false;

      if (errorMessage) {
        handleFunctionError(errorMessage, errorStatus);
        return;
      }

      if (data?.error) {
        handleFunctionError(data.error);
        return;
      }

      setAvailablePromotions((items) => items.filter((item) => item.userPromotionId !== userPromotionId));
      if (data?.user) setScannedUser(data.user);
      setRedemptionState({
        status: 'success',
        message: data?.promotion?.title ? `${data.promotion.title} redeemed` : 'Promotion redeemed',
        detail: data?.promotion?.noteToStaff || 'The selected promotion is now marked as redeemed.',
      });
    },
    [handleFunctionError, session],
  );

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setSession(readStoredSession());
      setIsHydrated(true);
    }, 0);

    return () => {
      window.clearTimeout(hydrationTimer);
      stopScanner();
    };
  }, [stopScanner]);

  const startScanner = useCallback(async () => {
    setScannerError('');
    setRedemptionState({ status: 'idle' });

    if (!navigator.mediaDevices?.getUserMedia) {
      setScannerError('Camera access is not available in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setIsScanning(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const scan = () => {
        if (!videoRef.current || !streamRef.current || redeemingRef.current) {
          scanLoopRef.current = window.requestAnimationFrame(scan);
          return;
        }

        try {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const width = video.videoWidth;
          const height = video.videoHeight;

          if (!canvas || width === 0 || height === 0) {
            scanLoopRef.current = window.requestAnimationFrame(scan);
            return;
          }

          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext('2d', { willReadFrequently: true });

          if (!context) {
            scanLoopRef.current = window.requestAnimationFrame(scan);
            return;
          }

          context.drawImage(video, 0, 0, width, height);
          const imageData = context.getImageData(0, 0, width, height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (qrCode?.data) {
            void lookupPromotions(qrCode.data);
            return;
          }
        } catch {
          setScannerError('Unable to read QR from the camera feed. Try better lighting or use manual entry.');
        }

        scanLoopRef.current = window.requestAnimationFrame(scan);
      };

      scanLoopRef.current = window.requestAnimationFrame(scan);
    } catch {
      setScannerError('Camera permission was blocked or no camera was found.');
      stopScanner();
    }
  }, [lookupPromotions, stopScanner]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setLoginError('Enter a staff access code.');
      return;
    }

    setIsLoggingIn(true);
    const deviceId = getStoredDeviceId();

    let data: LoginResponse | null = null;
    let errorMessage = '';
    let errorStatus: number | undefined;

    try {
      const response = await getStaffSupabaseClient().functions.invoke<LoginResponse>('staff-code-login', {
        body: {
          code: trimmedCode,
          deviceId,
          deviceName: getDeviceName(),
        },
      });

      data = response.data;
      if (response.error) {
        const details = await getFunctionErrorDetails(response.error);
        errorMessage = details.message;
        errorStatus = details.status;
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Unable to start staff session.';
    }

    setIsLoggingIn(false);

    if (errorMessage) {
      setLoginError(mapFunctionError(errorMessage, errorStatus));
      return;
    }

    if (!data?.sessionToken || !data.access) {
      setLoginError('Login response was missing a staff session.');
      return;
    }

    window.localStorage.setItem(DEVICE_STORAGE_KEY, data.deviceId || deviceId);
    const nextSession = { ...data, deviceId: data.deviceId || deviceId };
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    setCode('');
    setScannedUser(null);
    setAvailablePromotions([]);
    setRedemptionState({ status: 'idle' });
  };

  const scopeLabel = useMemo(() => {
    if (!session) return '';
    if (session.access.venueId && session.access.eventId) return 'Venue + event scope';
    if (session.access.eventId) return 'Event scope';
    if (session.access.venueId) return 'Venue scope';
    return 'Company scope';
  }, [session]);

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-[#09090B] text-white grid place-items-center">
        <Loader2 className="size-8 animate-spin text-live-red" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-dvh bg-[#050506] px-4 py-5 text-white selection:bg-live-red/30 sm:px-5 sm:py-6">
        <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] w-full max-w-md flex-col justify-center">
          <div className="mb-6 flex items-center gap-3">
            <Image src="/images/icon.png" alt="Bouncinn" width={32} height={32} className="h-8 w-auto" priority />
            <div>
              <p className="text-lg font-black tracking-tight">BOUNCINN</p>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Staff Access</p>
            </div>
          </div>

          <section className="rounded-lg border border-white/10 bg-[#111114]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-live-red/35 bg-live-red/10 text-live-red shadow-[0_0_30px_rgba(255,72,72,0.18)]">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Enter staff code</h1>
            <p className="mt-2 text-sm leading-6 text-white/55">Secure staff redemption access.</p>

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <div className="space-y-2">
                <label htmlFor="staff-code" className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                  Access code
                </label>
                <Input
                  id="staff-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  autoCapitalize="characters"
                  autoComplete="one-time-code"
                  placeholder="XXXX-XXXX"
                  className="h-14 rounded-lg border-white/10 bg-black/45 px-4 text-center text-lg font-black tracking-[0.18em] text-white placeholder:text-white/20 focus-visible:border-live-red/60 focus-visible:ring-live-red/70"
                />
              </div>

              {loginError ? (
                <div className="flex gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-red-100">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="h-14 w-full rounded-lg bg-live-red text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_14px_34px_rgba(255,72,72,0.22)] hover:bg-live-red/90 active:scale-[0.99]"
              >
                {isLoggingIn ? <Loader2 className="mr-2 size-4 animate-spin" /> : <DoorOpen className="mr-2 size-4" />}
                Continue
              </Button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#050506] pb-24 text-white selection:bg-live-red/30 sm:pb-6">
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#050506]/95 shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <Image src="/images/icon.png" alt="Bouncinn" width={28} height={28} className="h-7 w-auto" priority />
            <div>
              <p className="text-base font-black tracking-tight">BOUNCINN</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Staff Portal</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => {
              stopScanner();
              clearSession();
            }}
            className="h-11 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-white hover:bg-white/10"
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 sm:px-5 sm:py-6">
        <aside className="-order-1">
          <section className="rounded-lg border border-white/[0.08] bg-[#111114]/85 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg border border-success/20 bg-success/10 text-success">
                <BadgeCheck className="size-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-black">Active staff session</h2>
                <p className="truncate text-xs text-white/45">{session.access.label || 'Staff access'} · {scopeLabel}</p>
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-white/45">Expires {formatExpiry(session.access.expiresAt)}</p>
          </section>
        </aside>

        <section className="rounded-lg border border-white/[0.08] bg-[#111114]/85 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:p-5">
          <div className="mb-4 flex flex-col gap-3">
            <div>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">Scan promotion QR</h1>
              <p className="mt-1 text-sm text-white/50">Scan guest QR and choose the promotion.</p>
            </div>
            <div className="hidden sm:flex">
              <Button
                type="button"
                onClick={isScanning ? stopScanner : startScanner}
                disabled={isRedeeming}
                className="h-12 w-full rounded-lg bg-live-red px-4 font-bold text-white shadow-[0_14px_34px_rgba(255,72,72,0.2)] hover:bg-live-red/90 sm:w-auto"
              >
                {isScanning ? <RefreshCw className="mr-2 size-4" /> : <Camera className="mr-2 size-4" />}
                {isScanning ? 'Stop' : 'Scan'}
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={!isScanning && !isRedeeming ? startScanner : undefined}
            disabled={isRedeeming}
            className="relative mx-auto block aspect-square w-full max-w-[520px] overflow-hidden rounded-lg border border-white/10 bg-black text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-red/70 disabled:cursor-not-allowed"
            aria-label={isScanning ? 'Camera scanner active' : 'Press to scan QR'}
          >
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
            <div className="pointer-events-none absolute inset-5 rounded-lg border border-white/10" />
            <div className="pointer-events-none absolute left-5 top-5 h-10 w-10 rounded-tl-lg border-l-2 border-t-2 border-live-red" />
            <div className="pointer-events-none absolute right-5 top-5 h-10 w-10 rounded-tr-lg border-r-2 border-t-2 border-live-red" />
            <div className="pointer-events-none absolute bottom-5 left-5 h-10 w-10 rounded-bl-lg border-b-2 border-l-2 border-live-red" />
            <div className="pointer-events-none absolute bottom-5 right-5 h-10 w-10 rounded-br-lg border-b-2 border-r-2 border-live-red" />
            {!isScanning ? (
              <div className="absolute inset-0 grid place-items-center bg-black">
                <div className="text-center">
                  <div className="mx-auto mb-3 grid size-16 place-items-center rounded-lg border border-live-red/35 bg-live-red/10">
                    <QrCode className="size-8 text-live-red" />
                  </div>
                  <p className="text-sm font-black text-white">Press to scan QR</p>
                </div>
              </div>
            ) : null}
            {isRedeeming ? (
              <div className="absolute inset-0 grid place-items-center bg-black/70">
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/85 px-4 py-3 text-sm font-bold shadow-2xl">
                  <Loader2 className="size-5 animate-spin text-live-red" />
                  {activePromotionId ? 'Redeeming promotion' : 'Checking promotions'}
                </div>
              </div>
            ) : null}
          </button>

          {isScanning ? (
            <Button
              type="button"
              onClick={stopScanner}
              disabled={isRedeeming}
              className="mt-3 h-12 w-full rounded-lg border border-white/10 bg-white/[0.04] font-bold text-white hover:bg-white/10"
            >
              <RefreshCw className="mr-2 size-4" />
              Close camera
            </Button>
          ) : null}

          {scannerError ? (
            <div className="mt-4 flex gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-amber-100">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{scannerError}</span>
            </div>
          ) : null}

          {availablePromotions.length > 0 ? (
            <section className="mt-5 rounded-lg border border-white/[0.08] bg-black/30 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.2)] sm:p-4">
              {scannedUser ? (
                <div className="mb-4 rounded-lg border border-white/10 bg-[#151518] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Guest</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-live-red/25 bg-live-red/10 text-base font-black text-live-red">
                      {scannedUser.photoUrl ? (
                        <Image
                          src={scannedUser.photoUrl}
                          alt={scannedUser.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        scannedUser.name.slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-black text-white">{scannedUser.name}</p>
                      {scannedUser.username ? (
                        <p className="truncate text-sm font-medium text-white/50">@{scannedUser.username}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-black">Available promotions</h2>
                  <p className="mt-1 text-sm text-white/50">Select the exact promotion the guest wants to use.</p>
                </div>
                <span className="rounded-full border border-live-red/25 bg-live-red/10 px-3 py-1 text-xs font-bold text-live-red">
                  {availablePromotions.length}
                </span>
              </div>

              <div className="space-y-3">
                {availablePromotions.map((item) => {
                  const validUntil = formatOptionalDate(item.promotion.endsAt || item.promotion.validUntil);
                  return (
                    <article
                      key={item.userPromotionId}
                      className="rounded-lg border border-white/[0.08] bg-[#151518] p-3 shadow-[0_14px_44px_rgba(0,0,0,0.18)] sm:p-4"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="min-w-0">
                          {item.promotion.bannerUrl ? (
                            <div className="mb-4 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                              <Image
                                src={item.promotion.bannerUrl}
                                alt={item.promotion.title || 'Promotion banner'}
                                width={720}
                                height={240}
                                className="h-32 w-full object-cover"
                              />
                            </div>
                          ) : null}
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-lg font-black leading-tight text-white">
                              {item.promotion.title || 'Promotion'}
                            </h3>
                            {item.promotion.type ? (
                              <span className="shrink-0 rounded-full border border-live-red/25 bg-live-red/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-live-red">
                                {humanizeValue(item.promotion.type)}
                              </span>
                            ) : null}
                          </div>
                          {item.promotion.description ? (
                            <p className="mt-2 text-sm leading-6 text-white/70">{item.promotion.description}</p>
                          ) : null}
                          {item.promotion.noteToStaff ? (
                            <div className="mt-3 rounded-lg border border-live-red/20 bg-live-red/10 p-3">
                              <p className="text-xs font-black uppercase tracking-[0.16em] text-live-red">Note to staff</p>
                              <p className="mt-1 text-sm leading-6 text-white/80">{item.promotion.noteToStaff}</p>
                            </div>
                          ) : null}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-white/50">
                            <span className="rounded-full bg-white/5 px-2.5 py-1">User status: {humanizeValue(item.status) || item.status}</span>
                            {item.promotion.status ? (
                              <span className="rounded-full bg-white/5 px-2.5 py-1">Promotion: {humanizeValue(item.promotion.status)}</span>
                            ) : null}
                            {item.promotion.type ? (
                              <span className="rounded-full bg-white/5 px-2.5 py-1">Type: {humanizeValue(item.promotion.type)}</span>
                            ) : null}
                            {validUntil ? <span className="rounded-full bg-white/5 px-2.5 py-1">Valid until {validUntil}</span> : null}
                            {item.promotion.startsAt ? (
                              <span className="rounded-full bg-white/5 px-2.5 py-1">Starts {formatOptionalDate(item.promotion.startsAt)}</span>
                            ) : null}
                            {item.promotion.venueId ? (
                              <span className="rounded-full bg-white/5 px-2.5 py-1">Venue scoped</span>
                            ) : null}
                            {item.promotion.eventId ? (
                              <span className="rounded-full bg-white/5 px-2.5 py-1">Event scoped</span>
                            ) : null}
                          </div>
                        </div>

                        <Button
                          type="button"
                          disabled={isRedeeming}
                          onClick={() => void redeemSelectedPromotion(item.userPromotionId)}
                          className="h-14 w-full shrink-0 rounded-lg bg-live-red px-4 font-black text-white shadow-[0_14px_34px_rgba(255,72,72,0.2)] hover:bg-live-red/90 active:scale-[0.99]"
                        >
                          {activePromotionId === item.userPromotionId ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                          ) : (
                            <TicketCheck className="mr-2 size-4" />
                          )}
                          Use promotion
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {redemptionState.status !== 'idle' ? (
            <div
              className={`mt-5 rounded-lg border p-4 ${
                redemptionState.status === 'success'
                  ? 'border-success/30 bg-success/10 text-emerald-50'
                  : 'border-danger/30 bg-danger/10 text-red-50'
              }`}
            >
              <div className="flex gap-3">
                {redemptionState.status === 'success' ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                ) : (
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" />
                )}
                <div>
                  <p className="font-black">{redemptionState.message}</p>
                  {redemptionState.detail ? <p className="mt-1 text-sm opacity-75">{redemptionState.detail}</p> : null}
                </div>
              </div>
            </div>
          ) : null}
        </section>

      </div>

    </main>
  );
}
