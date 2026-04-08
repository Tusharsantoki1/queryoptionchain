import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import IndexPage from "./pages/IndexPage";
import OptionChain from "./components/OptionChain/OptionChain";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
       
      <ReactQueryDevtools initialIsOpen={false} />
      <IndexPage />
      <OptionChain />
    </QueryClientProvider>
  );
}

export default App;