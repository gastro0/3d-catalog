import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { CatalogView } from '../../features/catalog/CatalogView';
import { categories, Category } from '../../features/catalog/categories';
import { usePreferences } from '../../providers/PreferencesProvider';

export default function CategoryPage({ category }: { category: Category }) {
  const { lang, t } = usePreferences();
  return (
    <SiteLayout title={`${category[lang]} — ModelHub`}>
      <div className="container page-section">
        <div className="page-heading">
          <Link className="breadcrumb" href="/categories">
            ← {t('Все категории', 'All categories')}
          </Link>
          <p className="eyebrow">{t('КАТЕГОРИЯ', 'CATEGORY')}</p>
          <h1>{category[lang]}.</h1>
          <p>{lang === 'ru' ? category.detail : category.detailEn}</p>
        </div>
        <CatalogView category={category} />
      </div>
    </SiteLayout>
  );
}
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: categories.map((category) => ({ params: { slug: category.slug } })),
  fallback: false,
});
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = categories.find((item) => item.slug === params?.slug);
  return category ? { props: { category } } : { notFound: true };
};
