import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConfirmationDialogueProps {
  isOpen?: boolean;
  openDialog?: (state: boolean) => void;
  header?: string;
  description?: string;
  loading?: boolean;
  onAction?: () => void;
}
const ConfirmationDialogue = ({
  isOpen,
  openDialog,
  header = "Delete Entities",
  description = "This action cannot be undone. Are you sure you want to proceed?",
  loading = false,
  onAction,
}: ConfirmationDialogueProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={openDialog}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-md">
          <div className="flex flex-col gap-0">
            <div className="py-sm gap-2">
              <h4>{header}</h4>
            </div>
            <div className="py-sm gap-6">
              <p className="text-body-passive leading-[1.5] tracking-[0.03] text-[15px] font-medium">
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-main">
            <DialogClose asChild>
              <Button
                disabled={loading}
                size={"neutral"}
                variant={"ghost"}
                className={`text-[15px] text-secondary-foreground tracking-[0.02em] leading-[1] hover:no-underline`}
              >
                <span className="py-4 px-2">Cancel</span>
              </Button>
            </DialogClose>

            <Button
              onClick={onAction}
              type="button"
              disabled={loading}
              size={"neutral"}
              // variant={"filter"}
              className={`text-[15px] bg-destructive tracking-[0.02em] leading-[1] shadow-input hover:bg-destructive/80`}
            >
              {loading && <Spinner color="white" />}
              <span className="py-4 px-2">
                {loading ? "Deleting..." : "Delete"}
              </span>
            </Button>
          </div>
        </div>
        {/* <DialogFooter>
          <Button>Submit</Button>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialogue;
