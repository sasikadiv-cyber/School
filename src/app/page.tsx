import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { PrincipalMessage } from "@/components/principal-message";
import { AboutUs } from "@/components/about-us";
import { NewsEvents } from "@/components/news-events";
import { Academics } from "@/components/academics";
import { Footer } from "@/components/footer";
import { EditableSection } from "@/components/cms/editable-section";
import { LiveSiteEditor } from "@/components/admin/live-site-editor";
import { getAdminSession } from "@/lib/admin-auth";
import { getCmsPage } from "@/lib/cms";
import { getCmsPageDefinition } from "@/lib/cms-defaults";
import { VisualBlockSections } from "@/components/cms/visual-block-sections";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    cmsPreview?: string;
    cmsEditor?: string;
    edit?: string;
  }>;
}) {
  const { cmsPreview, cmsEditor, edit } = await searchParams;
  const session = await getAdminSession();
  const preview = cmsPreview === "1" && Boolean(session);
  const editor = cmsEditor === "1" && Boolean(session);
  const draftMode = preview || editor;
  const editable = draftMode && edit === "1";
  const page = await getCmsPage("home", draftMode ? "draft" : "published");
  const definition = getCmsPageDefinition("home");

  const components: Record<string, (data: Record<string, string>) => React.ReactNode> = {
    hero: (data) => <Hero content={data} />,
    principal: (data) => <PrincipalMessage content={data} />,
    about: (data) => <AboutUs content={data} />,
    news: (data) => <NewsEvents content={data} />,
    academics: (data) => <Academics content={data} />,
  };

  return (
    <main id="home" className="relative bg-surface text-fg">
      <Navbar />
      <div className="flex flex-col">
        {page?.sections.map((section) => (
          <EditableSection
            key={section.key}
            sectionKey={section.key}
            label={section.label}
            preview={draftMode}
            editable={editable}
            hidden={section.hidden}
          >
            {components[section.key]?.(section.data)}
          </EditableSection>
        ))}
      </div>
      <VisualBlockSections path="/" />
      <Footer />
      {editor && page && definition && (
        <LiveSiteEditor initialPage={page} definition={definition} />
      )}
    </main>
  );
}
