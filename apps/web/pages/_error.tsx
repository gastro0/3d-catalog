import type { NextPageContext } from 'next';
import Link from 'next/link';
import { SiteLayout } from '../components/layout/SiteLayout';

function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <SiteLayout title={`Ошибка ${statusCode} — ModelHub`}>
      <div className="container empty-state">
        <h1>Не удалось открыть страницу</h1>
        <p>Код ошибки: {statusCode}. Попробуйте обновить страницу.</p>
        <Link href="/" className="button">
          На главную
        </Link>
      </div>
    </SiteLayout>
  );
}
ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => ({
  statusCode: res?.statusCode || err?.statusCode || 404,
});
export default ErrorPage;
