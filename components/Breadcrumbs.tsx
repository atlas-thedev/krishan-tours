import Link from "@/components/LocalizedLink";
import { getI18n } from "@/lib/i18n/server";

/** Visible breadcrumbs matching the detail pages’ existing structured data. */
export async function Breadcrumbs({ parent, current }: {
  parent: { label: string; href: string };
  current: { label: string; href: string };
}) {
  const { t } = await getI18n();
  const items = [
    { label: t("Home"), href: "/" },
    { label: t(parent.label), href: parent.href },
    { label: t(current.label), href: current.href },
  ];
  return <nav aria-label={t("Breadcrumb")} className="shell py-5 text-xs text-ink/65">
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {items.map((item, index) => <li key={item.href} className="flex items-center gap-2">
        {index > 0 && <span aria-hidden="true">/</span>}
        {index === items.length - 1 ? <span aria-current="page">{item.label}</span> : <Link href={item.href} className="underline underline-offset-4 hover:text-cinnamon">{item.label}</Link>}
      </li>)}
    </ol>
  </nav>;
}
