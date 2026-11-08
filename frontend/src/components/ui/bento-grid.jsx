import { cn } from "../../lib/utils";

export const BentoGrid = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[12rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  value,
  change,
  colorClass
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-sm p-6 bg-white border border-gray-200 justify-between flex flex-col space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-3 rounded-lg ${colorClass || 'bg-gray-100'}`}>
          {icon}
        </div>
        {change && (
          <span className="text-sm text-green-600 font-medium">{change}</span>
        )}
      </div>
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        <div className="font-bold text-3xl text-gray-900 mb-1">
          {value || title}
        </div>
        <div className="font-medium text-gray-600 text-sm">
          {description}
        </div>
      </div>
    </div>
  );
};
