import React from "react";
import { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const title = "Join my group on Bouncinn";
  const description = "Join my group on Bouncinn — open the app or visit the site to accept the invite.";
  const url = `https://www.bouncinn.com/invite/group/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Bouncinn",
      images: [
        {
          url: "https://www.bouncinn.com/images/promotionimage.png",
          alt: "Join on Bouncinn",
        },
      ],
    },
  };
}

export default function InvitePreview({ params }: Props) {
  const { id } = params;
  const redirectUrl = `https://www.bouncinn.com/app?invite=group:${id}`;

  return (
    <main style={{fontFamily: 'system-ui, sans-serif', padding: 24}}>
      <h1>Opening invite…</h1>
      <p>If you are not redirected automatically, <a href={redirectUrl}>click here</a> to open the invite.</p>
      <script
        // inline script is intentional: small client-side redirect for regular browsers
        // this doesn't affect crawlers that read OG meta for previews
        dangerouslySetInnerHTML={{__html: `window.location.replace('${redirectUrl}');`}}
      />
    </main>
  );
}
