import StudioClient from "./studio-client";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body > header,
            body > footer,
            body > script + div {
              display: none !important;
            }

            body {
              overflow: hidden !important;
              background: #101119 !important;
            }
          `,
        }}
      />
      <StudioClient />
    </>
  );
}
