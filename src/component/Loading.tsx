export default function Loading() {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
      <img src="/loading.gif" className="w-1/12"></img>
    </div>
  );
}
