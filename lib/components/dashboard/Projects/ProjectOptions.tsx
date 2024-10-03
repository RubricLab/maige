import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Props = {
	projectId: string;
};

export default function ProjectOptions(_: Props) {
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="focus-visible:outline-none">
					<DotsHorizontalIcon />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="z-10 mr-28 w-[135px]">
					<DropdownMenuItem className="cursor-pointer">
						View Runs
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer">
						Something...
					</DropdownMenuItem>
					<DropdownMenuItem className="hover:!bg-red-500 hover:!bg-opacity-25 hover:!text-red-500 cursor-pointer text-red-500">
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
