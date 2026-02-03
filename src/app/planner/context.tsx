import { createContext } from "react";

export const PlannerContext = createContext(null);

// export function usePlannerContext(): BoardContextValue {
// 	const value = useContext(BoardContext);
// 	invariant(value, 'cannot find BoardContext provider');
// 	return value;
// }
