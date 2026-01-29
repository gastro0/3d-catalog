import React from "react";

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Произошла ошибка</h1>
      <p>
        {statusCode
          ? `Ошибка сервера: ${statusCode}`
          : 'Произошла ошибка на клиенте.'}
      </p>
      <p>Попробуйте обновить страницу или вернуться позже.</p>
    </div>
  );
}

(Error as any).getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
