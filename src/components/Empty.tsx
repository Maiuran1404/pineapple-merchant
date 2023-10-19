import { motion } from "framer-motion";
import { SlDrawer } from "react-icons/sl";

const Icon = () => <SlDrawer className="h-full w-full" />;

export default function Empty({
  text = "There's nothing here yet!",
  icon = <Icon />,
}: {
  text?: string;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      layout
      className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center "
    >
      <div className="mx-auto h-12 w-12 text-gray-300">{icon}</div>
      <span className="mt-6 block text-sm font-semibold text-gray-500">
        {text}
      </span>
    </motion.div>
  );
}
