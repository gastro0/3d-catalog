import React from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/router";

const Profile: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();

  React.useEffect(() => {
    const session = supabase.auth.getSession ? supabase.auth.getSession() : supabase.auth.session?.();
    if (session && session.user) {
      setUser(session.user);
    } else {
      // Попробуем получить пользователя через getUser (новые версии supabase-js)
      supabase.auth.getUser && supabase.auth.getUser().then(({ data }) => {
        if (data?.user) setUser(data.user);
      });
    }
  }, []);

  if (!user) {
    return <div style={{padding:40, textAlign:'center'}}>Загрузка профиля...</div>;
  }

  return (
    <div style={{maxWidth:500,margin:'40px auto',padding:32,background:'#fff',borderRadius:12,boxShadow:'0 2px 16px rgba(0,0,0,0.08)'}}>
      <h2 style={{marginBottom:24}}>Профиль пользователя</h2>
      <div style={{marginBottom:16}}>
        <b>Email:</b> {user.email}
      </div>
      <div style={{marginBottom:16}}>
        <b>ID:</b> {user.id}
      </div>
      {/* Можно добавить больше информации о пользователе */}
      <button
        style={{marginTop:24,padding:'10px 24px',borderRadius:8,background:'#e94e77',color:'#fff',border:'none',fontWeight:600,cursor:'pointer'}}
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/");
        }}
      >
        Выйти
      </button>
    </div>
  );
};

export default Profile;
