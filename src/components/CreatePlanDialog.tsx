import React from "react";
import { differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PastContest {
  id: string;
  name: string;
  date: string;
  rating: number;
}

interface GeneratedEvent {
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    type: string;
    contestId: string;
  };
}

interface CreatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (events: GeneratedEvent[]) => void;
  pastContests: PastContest[];
  isLoading: boolean;
  error: boolean;
  selectedDate?: Date | null;
}

export const CreatePlanDialog = ({
  isOpen,
  onClose,
  onSubmit,
  pastContests,
  isLoading,
  error,
  selectedDate,
}: CreatePlanDialogProps) => {
  const [planName, setPlanName] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [selectedModules, setSelectedModules] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  }, [selectedDate]);

  const handleSubmit = () => {
    if (!planName || !startDate || !endDate || selectedModules.length === 0) {
      // Basic validation
      alert("Please fill all fields and select at least one module.");
      return;
    }

    const totalDays = differenceInDays(endDate, startDate) + 1;
    if (totalDays <= 0) {
      alert("End date must be after start date.");
      return;
    }

    const daysPerModule = Math.floor(totalDays / selectedModules.length);
    if (daysPerModule < 1) {
      alert(
        "Not enough days to cover all selected modules. Please extend the duration or select fewer modules."
      );
      return;
    }

    const generatedEvents: GeneratedEvent[] = [];
    const currentDay = new Date(startDate);

    selectedModules.forEach((moduleId) => {
      const contest = pastContests?.find((c) => c.id === moduleId);
      if (contest) {
        const eventEnd = new Date(currentDay);
        eventEnd.setDate(eventEnd.getDate() + daysPerModule - 1);

        generatedEvents.push({
          title: `Plan: ${contest.name}`,
          start: new Date(currentDay),
          end: eventEnd,
          backgroundColor: "#4caf50",
          borderColor: "#4caf50",
          extendedProps: {
            type: "plan",
            contestId: contest.id,
          },
        });

        currentDay.setDate(currentDay.getDate() + daysPerModule);
      }
    });

    console.log("Generated Plan:", {
      planName,
      startDate,
      endDate,
      modules: selectedModules,
      events: generatedEvents,
    });
    console.log("TODO: Save this plan to the database.");

    onSubmit(generatedEvents);
    onClose();
  };

  const handleSelectModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Training Plan</DialogTitle>
          <DialogDescription>
            Schedule your practice by selecting past contests to solve.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Plan Name
            </Label>
            <Input
              id="name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal col-span-3",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal col-span-3",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Modules</Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-auto"
                  >
                    <div className="flex gap-1 flex-wrap">
                      {selectedModules.length > 0
                        ? selectedModules.map((id) => (
                            <Badge variant="secondary" key={id}>
                              {pastContests?.find((c) => c.id === id)?.name}
                            </Badge>
                          ))
                        : "Select modules..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search modules..." />
                    <CommandList>
                      <CommandEmpty>No modules found.</CommandEmpty>
                      <CommandGroup>
                        {isLoading && <CommandItem>Loading...</CommandItem>}
                        {error && (
                          <CommandItem>Error fetching contests.</CommandItem>
                        )}
                        {pastContests?.map((contest) => (
                          <CommandItem
                            key={contest.id}
                            onSelect={() => handleSelectModule(contest.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedModules.includes(contest.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {contest.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
