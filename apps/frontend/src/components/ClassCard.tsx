import { Button } from "@repo/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

export default function ClassCard() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Adding Database</span>
        </CardTitle>
        <CardDescription>
          Enhance your application with powerful database integration
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Join Now</Button>
      </CardFooter>
    </Card>
  );
}
