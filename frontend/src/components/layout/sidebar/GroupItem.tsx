import { SidebarMenuButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import type { Group } from "@/types/student/group";
import { SquareArrowOutUpRight } from "lucide-react";

type GroupItemProps = {
  group: Omit<Group, "messages">;
};

const GroupItem = ({ group }: GroupItemProps) => {
  return (
    <SidebarMenuSubItem key={group.id}>
      <SidebarMenuButton asChild>
        <a
          href={`/student/groups/${group.id}`}
          className="flex items-center justify-between"
        >
          {group.name}
          <SquareArrowOutUpRight />
        </a>
      </SidebarMenuButton>
    </SidebarMenuSubItem>
  );
};

export default GroupItem;
