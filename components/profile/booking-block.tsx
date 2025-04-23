import { Card, CardContent } from "@/components/ui/card";
import DOMPurify from "isomorphic-dompurify";

interface BookingBlockProps {
  html: string;
}

export function BookingBlock({ html }: BookingBlockProps) {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });

  return (
    <Card className="w-full mt-6">
      <CardContent className="p-3">
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </CardContent>
    </Card>
  );
}
