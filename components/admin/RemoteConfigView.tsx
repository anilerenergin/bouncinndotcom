'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import {
  Loader2, AlertTriangle, Save, CheckCircle2,
  ChevronDown, ChevronRight, ToggleLeft, ToggleRight,
  Code, FormInput,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RemoteConfig {
  id: number;
  key: string;
  description: string | null;
  value: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type EditorMode = 'visual' | 'json';

export default function RemoteConfigView() {
  const [configs, setConfigs] = useState<RemoteConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);
  const [editedJson, setEditedJson] = useState('');
  const [editedValue, setEditedValue] = useState<any>(null);
  const [jsonError, setJsonError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [editorMode, setEditorMode] = useState<EditorMode>('visual');

  const fetchConfigs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error: rpcErr } = await supabase.rpc('get_admin_remote_configs');
      if (rpcErr) throw rpcErr;
      setConfigs((data as RemoteConfig[]) || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load remote configs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const selectedConfig = configs.find((c) => c.id === selectedConfigId) || null;

  const handleSelect = (config: RemoteConfig) => {
    setSelectedConfigId(config.id);
    setEditedJson(JSON.stringify(config.value, null, 2));
    setEditedValue(structuredClone(config.value));
    setJsonError('');
    setSaveSuccess('');
  };

  const switchMode = (mode: EditorMode) => {
    setJsonError('');
    setSaveSuccess('');
    if (mode === 'json' && editorMode === 'visual') {
      // Sync visual → json
      setEditedJson(JSON.stringify(editedValue, null, 2));
    } else if (mode === 'visual' && editorMode === 'json') {
      // Sync json → visual
      try {
        const parsed = JSON.parse(editedJson);
        setEditedValue(parsed);
      } catch (e: any) {
        setJsonError(`Cannot switch: Invalid JSON — ${e.message}`);
        return;
      }
    }
    setEditorMode(mode);
  };

  const getValueToSave = (): any | null => {
    if (editorMode === 'json') {
      try {
        return JSON.parse(editedJson);
      } catch (e: any) {
        setJsonError(`Invalid JSON: ${e.message}`);
        return null;
      }
    }
    return editedValue;
  };

  const handleSave = async () => {
    if (!selectedConfig) return;
    setJsonError('');
    setSaveSuccess('');

    const parsedValue = getValueToSave();
    if (parsedValue === null) return;

    setIsSaving(true);
    try {
      const { data, error: rpcErr } = await supabase.rpc('update_admin_remote_config', {
        p_id: selectedConfig.id,
        p_value: parsedValue,
        p_is_active: selectedConfig.is_active,
      });
      if (rpcErr) throw rpcErr;

      setConfigs((prev) =>
        prev.map((c) =>
          c.id === selectedConfig.id
            ? { ...c, value: parsedValue, updated_at: (data as any)?.updated_at || new Date().toISOString() }
            : c
        )
      );
      // Keep both editors in sync after save
      setEditedValue(parsedValue);
      setEditedJson(JSON.stringify(parsedValue, null, 2));
      setSaveSuccess('Config saved successfully.');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err: any) {
      setJsonError(err.message || 'Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (config: RemoteConfig) => {
    const newActive = !config.is_active;
    try {
      const { error: rpcErr } = await supabase.rpc('update_admin_remote_config', {
        p_id: config.id,
        p_value: config.value,
        p_is_active: newActive,
      });
      if (rpcErr) throw rpcErr;
      setConfigs((prev) =>
        prev.map((c) => (c.id === config.id ? { ...c, is_active: newActive } : c))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to toggle.');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Remote Config</h2>
        <p className="mt-1 text-sm text-white/60">View and edit your app&apos;s remote configuration values in real time.</p>
      </div>

      {error && (
        <div className="mb-6 flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-live-red" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left: Config list */}
          <div className="space-y-2">
            {configs.map((config) => (
              <button
                key={config.id}
                onClick={() => handleSelect(config)}
                className={`w-full text-left rounded-lg border p-4 transition-all ${
                  selectedConfigId === config.id
                    ? 'border-live-red/50 bg-live-red/10'
                    : 'border-white/10 bg-[#111114] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                    {selectedConfigId === config.id ? (
                      <ChevronDown className="size-4 text-live-red" />
                    ) : (
                      <ChevronRight className="size-4 text-white/40" />
                    )}
                    <span className="font-mono text-sm font-bold">{config.key}</span>
                  </div>
                {config.description && (
                  <p className="mt-1 ml-6 text-xs text-white/40">{config.description}</p>
                )}
                <p className="mt-2 ml-6 text-[10px] text-white/30">
                  Updated {new Date(config.updated_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
              </button>
            ))}
          </div>

          {/* Right: Editor */}
          {selectedConfig ? (
            <div className="rounded-xl border border-white/10 bg-[#111114] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <h3 className="font-mono text-lg font-bold">{selectedConfig.key}</h3>
                  {selectedConfig.description && (
                    <p className="mt-1 text-xs text-white/50">{selectedConfig.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                      <CheckCircle2 className="size-4" />
                      {saveSuccess}
                    </span>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-live-red text-white hover:bg-live-red/90"
                  >
                    {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                    Save
                  </Button>
                </div>
              </div>

              {/* Mode Tabs */}
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => switchMode('visual')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    editorMode === 'visual'
                      ? 'border-live-red text-live-red'
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  <FormInput className="size-4" />
                  Visual Editor
                </button>
                <button
                  onClick={() => switchMode('json')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    editorMode === 'json'
                      ? 'border-live-red text-live-red'
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  <Code className="size-4" />
                  JSON Editor
                </button>
              </div>

              {/* Error */}
              {jsonError && (
                <div className="mx-6 mt-4 flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                  <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}

              {/* Editor Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {editorMode === 'visual' ? (
                  <VisualEditor value={editedValue} onChange={setEditedValue} path="" />
                ) : (
                  <textarea
                    value={editedJson}
                    onChange={(e) => { setEditedJson(e.target.value); setJsonError(''); setSaveSuccess(''); }}
                    spellCheck={false}
                    className="w-full min-h-[500px] rounded-lg border border-white/10 bg-black/50 p-4 font-mono text-sm text-white/90 placeholder:text-white/20 focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40 resize-y"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-[#111114] text-white/30">
              <p className="text-sm">Select a config from the left to view and edit.</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Visual Editor — renders each JSON key as a proper form control
   ───────────────────────────────────────────────────────────────────────────── */

function VisualEditor({
  value,
  onChange,
  path,
}: {
  value: any;
  onChange: (newVal: any) => void;
  path: string;
}) {
  if (value === null || value === undefined) {
    return (
      <div className="flex items-center gap-3">
        <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/40 font-mono">null</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-white/50 hover:text-white"
          onClick={() => onChange('')}
        >
          Set value
        </Button>
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <button
        onClick={() => onChange(!value)}
        className="flex items-center gap-2"
      >
        {value ? (
          <ToggleRight className="size-6 text-green-400" />
        ) : (
          <ToggleLeft className="size-6 text-white/40" />
        )}
        <span className={`text-sm font-medium ${value ? 'text-green-400' : 'text-white/50'}`}>
          {value ? 'true' : 'false'}
        </span>
      </button>
    );
  }

  if (typeof value === 'number') {
    return (
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        className="h-9 max-w-xs rounded-md border-white/10 bg-black/40 px-3 text-sm text-white font-mono focus-visible:border-live-red/60 focus-visible:ring-live-red/40"
      />
    );
  }

  if (typeof value === 'string') {
    // Long strings get a textarea
    if (value.length > 80) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40 resize-y"
        />
      );
    }
    return (
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 max-w-lg rounded-md border-white/10 bg-black/40 px-3 text-sm text-white focus-visible:border-live-red/60 focus-visible:ring-live-red/40"
      />
    );
  }

  if (Array.isArray(value)) {
    return (
      <ArrayEditor
        value={value}
        onChange={onChange}
        path={path}
      />
    );
  }

  if (typeof value === 'object') {
    return (
      <ObjectEditor
        value={value}
        onChange={onChange}
        path={path}
      />
    );
  }

  // Fallback
  return <span className="text-xs text-white/40 font-mono">{String(value)}</span>;
}

/* ─── Object Editor ─────────────────────────────────────────────────────────── */

function ObjectEditor({
  value,
  onChange,
  path,
}: {
  value: Record<string, any>;
  onChange: (val: Record<string, any>) => void;
  path: string;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const entries = Object.entries(value);

  const updateKey = (key: string, newVal: any) => {
    onChange({ ...value, [key]: newVal });
  };

  const isComplex = (v: any) => typeof v === 'object' && v !== null;

  return (
    <div className="space-y-1">
      {entries.map(([key, val]) => {
        const fullPath = path ? `${path}.${key}` : key;
        const complex = isComplex(val);
        const isCollapsed = collapsed[key] ?? true;

        return (
          <div key={key} className="rounded-lg border border-white/5 bg-white/[0.02]">
            {/* Row header */}
            <div
              className={`flex items-center gap-3 px-4 py-2.5 ${complex ? 'cursor-pointer hover:bg-white/5' : ''}`}
              onClick={() => {
                if (complex) setCollapsed((p) => ({ ...p, [key]: !isCollapsed }));
              }}
            >
              {complex && (
                isCollapsed
                  ? <ChevronRight className="size-3.5 text-white/40 shrink-0" />
                  : <ChevronDown className="size-3.5 text-live-red shrink-0" />
              )}

              <span className="font-mono text-xs font-bold text-white/70 shrink-0 min-w-[140px]">{key}</span>

              <TypeBadge value={val} />

              {!complex && (
                <div className="flex-1 ml-2">
                  <VisualEditor
                    value={val}
                    onChange={(v) => updateKey(key, v)}
                    path={fullPath}
                  />
                </div>
              )}
            </div>

            {/* Expanded children */}
            {complex && !isCollapsed && (
              <div className="border-t border-white/5 pl-8 pr-4 py-3">
                <VisualEditor
                  value={val}
                  onChange={(v) => updateKey(key, v)}
                  path={fullPath}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Array Editor ──────────────────────────────────────────────────────────── */

function ArrayEditor({
  value,
  onChange,
  path,
}: {
  value: any[];
  onChange: (val: any[]) => void;
  path: string;
}) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const updateIndex = (index: number, newVal: any) => {
    const copy = [...value];
    copy[index] = newVal;
    onChange(copy);
  };

  const removeIndex = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">{value.length} item{value.length !== 1 ? 's' : ''}</p>
      {value.map((item, i) => {
        const complex = typeof item === 'object' && item !== null;
        const isCollapsed = collapsed[i] ?? true;
        const fullPath = `${path}[${i}]`;

        return (
          <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02]">
            <div
              className={`flex items-center gap-3 px-4 py-2.5 ${complex ? 'cursor-pointer hover:bg-white/5' : ''}`}
              onClick={() => {
                if (complex) setCollapsed((p) => ({ ...p, [i]: !isCollapsed }));
              }}
            >
              {complex && (
                isCollapsed
                  ? <ChevronRight className="size-3.5 text-white/40 shrink-0" />
                  : <ChevronDown className="size-3.5 text-live-red shrink-0" />
              )}

              <span className="font-mono text-xs font-bold text-white/40 shrink-0 w-8">[{i}]</span>

              <TypeBadge value={item} />

              {!complex && (
                <div className="flex-1 ml-2">
                  <VisualEditor
                    value={item}
                    onChange={(v) => updateIndex(i, v)}
                    path={fullPath}
                  />
                </div>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); removeIndex(i); }}
                className="ml-auto text-white/20 hover:text-red-400 text-xs shrink-0"
                title="Remove item"
              >
                ✕
              </button>
            </div>

            {complex && !isCollapsed && (
              <div className="border-t border-white/5 pl-8 pr-4 py-3">
                <VisualEditor
                  value={item}
                  onChange={(v) => updateIndex(i, v)}
                  path={fullPath}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Type Badge ────────────────────────────────────────────────────────────── */

function TypeBadge({ value }: { value: any }) {
  let label = 'null';
  let color = 'bg-white/10 text-white/40';

  if (value === null || value === undefined) {
    // defaults
  } else if (typeof value === 'boolean') {
    label = 'bool';
    color = value ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
  } else if (typeof value === 'number') {
    label = 'num';
    color = 'bg-blue-500/20 text-blue-400';
  } else if (typeof value === 'string') {
    label = 'str';
    color = 'bg-amber-500/20 text-amber-400';
  } else if (Array.isArray(value)) {
    label = `arr[${value.length}]`;
    color = 'bg-purple-500/20 text-purple-400';
  } else if (typeof value === 'object') {
    label = `obj{${Object.keys(value).length}}`;
    color = 'bg-cyan-500/20 text-cyan-400';
  }

  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase shrink-0 ${color}`}>
      {label}
    </span>
  );
}
