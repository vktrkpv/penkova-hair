export default function DebugBar() {
  const ak = import.meta.env.VITE_FIREBASE_API_KEY || "";
  // безпечно показуємо тільки довжину і перші 4 символи
  const masked = ak ? `${ak.slice(0,4)}… (len:${ak.length})` : "—";
  return (
    <div style={{position:'fixed',bottom:8,left:8,zIndex:9999,background:'#111',color:'#fff',padding:'6px 10px',borderRadius:6,fontSize:12,opacity:.85}}>
      apiKey: {masked}
    </div>
  );
}
