import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
const App = () => {
  return (
    <div>
      <Button>ghiu</Button>
      <div className="bg-red-100 py-3">hello</div>
      <button className={cn(buttonVariants())}>hjihihihi</button>
    </div>
  );
};

export default App;
