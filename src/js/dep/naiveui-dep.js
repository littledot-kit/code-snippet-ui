import {
    create,
    NButton,
    NCard,
    NCode,
    NCheckbox,
    NColorPicker,
    NConfigProvider,
    NDrawer,
    NDrawerContent,
    NEllipsis,
    NForm,
    NFormItem,
    NInput,
    NList,
    NListItem,
    NMessageProvider,
    NPopover,
    NResult,
    NScrollbar,
    NSelect,
    NSpace,
    NSwitch,
    NTabPane,
    NTabs,
    NTag,
    NTooltip,
    NDivider,
    NModal,
    NDialogProvider,
    NDynamicTags,
    NBreadcrumb,
    NBreadcrumbItem,
    NCollapse,
    NCollapseItem,
    NDropdown
} from 'naive-ui'


const naive = create({
    components:[NButton,
        NCard,
        NCode,
        NCheckbox,
        NColorPicker,
        NConfigProvider,
        NDrawer,
        NDrawerContent,
        NDynamicTags,
        NEllipsis,
        NForm,
        NFormItem,
        NInput,
        NList,
        NListItem,
        NMessageProvider,
        NPopover,
        NResult,
        NScrollbar,
        NSelect,
        NSpace,
        NSwitch,
        NTabPane,
        NTabs,
        NTag,
        NTooltip,
        NDivider,
        NModal,
        NDialogProvider,
        NBreadcrumb,
        NBreadcrumbItem,
        NCollapse,
        NCollapseItem,
        NDropdown
    ]
})

export default function initNU(app){
    app.use(naive)
}