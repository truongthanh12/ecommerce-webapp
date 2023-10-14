import { useParams, useRouter } from "next/navigation";

const useCustomRouter = () => {
  const router = useRouter();
  const params = useParams();

  const pushRouter = (url: string) => {
    router.push(`/${params.lang}/${url}`);
  };

  return {
    pushRouter,
  };
};

export default useCustomRouter;
