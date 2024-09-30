"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@repo/ui/scroll-area";

// interface FullScreenDialogProps {
//   onClose: () => void;
//   onNext: () => void;
//   onPrev: () => void;
// }

export default function QuestionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  //   const [votes, setVotes] = useState(0);

  //   const handleClose = () => {
  //     setIsOpen(false);
  //     onClose();
  //   };

  //   const handleUpvote = () => setVotes(votes + 1);
  //   const handleDownvote = () => setVotes(votes - 1);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-full h-screen flex flex-col">
        <DialogHeader className="border-b pb-3">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow p-6">
          <h2 className="text-xl font-semibold mb-4">Demo Content</h2>
          {Array(20)
            .fill(0)
            .map((_, index) => (
              <p key={index} className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                euismod, nisi vel consectetur interdum, nisl nunc egestas nunc,
                vitae tincidunt nisl nunc euismod nunc. Sed euismod, nisi vel
                consectetur interdum, nisl nunc egestas nunc, vitae tincidunt
                nisl nunc euismod nunc.
              </p>
            ))}
        </ScrollArea>
        <DialogFooter className="flex flex-row items-center justify-between p-4 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">0</span>
            <Button variant="outline" size="icon">
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button variant="outline">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
