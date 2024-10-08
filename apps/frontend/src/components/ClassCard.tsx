import { Button } from "@repo/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Link } from "react-router-dom";

export default function ClassCard({
  classData,
}: {
  classData: { name: string; description: string; id: string };
}) {
  return (
    <Link to={`/class/${classData.id}`}>
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{classData.name}</span>
          </CardTitle>
          <CardDescription>{classData.description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full">Join Now</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
