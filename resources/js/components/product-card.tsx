import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function ProductCard() {
  return (
    <Card className="w-80 overflow-hidden">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src="https://via.placeholder.com/300x200"
            alt="Produto"
            className="rounded-t-md object-cover w-full h-full"
          />
        </AspectRatio>
      </CardHeader>

      <CardContent>
        <CardTitle className="text-lg">Título do Produto</CardTitle>
        <CardDescription>
          Uma breve descrição do produto, falando sobre suas características principais.
        </CardDescription>
      </CardContent>

      <CardFooter>
        <Button className="w-full">Acessar Produto</Button>
      </CardFooter>
    </Card>
  );
}
