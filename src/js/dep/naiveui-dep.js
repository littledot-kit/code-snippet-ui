import {
    create,
    NButton,
    NCard,
    NCode,
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
    NBreadcrumbItem
} from 'naive-ui'


const naive = create({
    components:[NButton,
        NCard,
        NCode,
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
        NBreadcrumbItem
    ]
})

export default function initNU(app){
    app.use(naive)
}