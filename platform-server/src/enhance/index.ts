import { CategoryActionsMap } from '@/enhance/category'; 
import { ResolversEnhanceMap, applyResolversEnhanceMap } from '@/generated';

export const enhance = () => {
    const resolversEnhanceMap: ResolversEnhanceMap = {
        Category: CategoryActionsMap,
    };

    applyResolversEnhanceMap(resolversEnhanceMap);
}
