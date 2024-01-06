import { useRouter } from "next/navigation";

const useCustomRouter = () => {
  const router = useRouter();

  const pushRouter = (url: string) => {
    const newUrl = url.replace(/\/$/, "");
    router.push(`/${newUrl}`);
  };

  return {
    pushRouter,
  };
};

export default useCustomRouter;
