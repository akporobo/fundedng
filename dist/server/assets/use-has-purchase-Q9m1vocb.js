import { r as reactExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAuth, s as supabase } from "./router-DudJYIfW.js";
function useHasPurchase() {
  const { user } = useAuth();
  const [hasPurchase, setHasPurchase] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!user) {
      setHasPurchase(false);
      return;
    }
    let cancelled = false;
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id).in("status", ["paid", "delivered"]).then(({ count }) => {
      if (!cancelled) setHasPurchase((count ?? 0) > 0);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);
  return hasPurchase;
}
export {
  useHasPurchase as u
};
