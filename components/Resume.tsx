import { Button } from "./Button";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";
import { BriefcaseIcon } from "./icons/BriefcaseIcon";

export function Resume() {
  
    return (
      <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40 mt-10 mb-10">
        {/* <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <BriefcaseIcon className="h-6 w-6 flex-none" />
          <span className="ml-3">Work</span>
        </h2> */}
        <Button href="/CV.pdf" variant="secondary" className="group mt-6 w-full mb-6">
          Download CV
          <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
        </Button>
      </div>
    )
  }