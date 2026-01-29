import React from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/router";

interface UserAvatarProps {
  avatarUrl?: string;
  email?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl, email }) => {
  const [open, setOpen] = React.useState(false);
  const avatarRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // React.useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
  //       setOpen(false);
  //     }
  //   };
  //   if (open) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   }
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [open]);

  const handleSignOut = async () => {
    alert('Sign out button clicked');
    console.log('Sign out button clicked');
    setOpen(false);
    await supabase.auth.signOut();
    router.push("/");
  };



  return (
    <div style={{position:'relative',display:'inline-block'}}>
      <button
        ref={avatarRef}
        tabIndex={0}
        onClick={() => {
          setOpen((v) => {
            const newOpen = !v;
            console.log('Avatar button clicked, open:', newOpen);
            return newOpen;
          });
        }}
        className="bw-btn"
        style={{width:40, height:40, borderRadius:'50%', background:'#fff', border:'none', display:'flex', alignItems:'center', justifyContent:'center', padding:0, boxShadow:'0 2px 10px 0 rgba(44,40,37,0.10)'}}
        aria-label="Профиль"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',boxShadow:'0 2px 12px rgba(44,40,37,0.10)'}} />
        ) : (
          <div style={{width:36,height:36,borderRadius:'50%',background:'#dedede',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,fontSize:18,color:'#444'}}>
            {email ? email[0].toUpperCase() : '?' }
          </div>
        )}
      </button>
      {open && (
        <div style={{position:'absolute',top:44,right:0,minWidth:140,background:'#fff',boxShadow:'0 2px 16px rgba(0,0,0,0.12)',borderRadius:10,zIndex:100,padding:'8px 0'}}>
          <button
            style={{display:'block',width:'100%',padding:'10px 18px',background:'none',border:'none',textAlign:'left',cursor:'pointer',fontSize:15}}
            onClick={() => { setOpen(false); router.push('/profile'); }}
          >
            Профиль
          </button>
          <button
            style={{display:'block',width:'100%',padding:'10px 18px',background:'none',border:'none',textAlign:'left',cursor:'pointer',fontSize:15,color:'#e94e77'}}
            onClick={handleSignOut}
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};
