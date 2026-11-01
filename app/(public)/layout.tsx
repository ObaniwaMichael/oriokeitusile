import { ChurchJsonLd } from "@/components/site/church-jsonld";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getSiteSettings } from "@/lib/site/get-site-settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <ChurchJsonLd settings={settings} />
      <SiteHeader settings={settings} />
      <div id="main-content" className="flex-1">
        {children}
      </div>
      <SiteFooter settings={settings} />
    </div>
  );
}
