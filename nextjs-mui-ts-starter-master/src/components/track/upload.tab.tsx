'use client'
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Step1 from './steps/step1';
import Step2 from './steps/step2';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const [percent, setPercent] = React.useState(0)
    const [fileName, setFileName] = React.useState('')
    const [fileUrl, setFileUrl] = React.useState('')
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', border: 'solid gray 1px', marginTop: 5 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Tracks" {...a11yProps(0)} disabled={value !== 0} />
                    <Tab label="Basic information " {...a11yProps(1)} disabled={value !== 1} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Step1 setPercent={setPercent} setValue={setValue} setFileName={setFileName} setFileUrl={setFileUrl} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Step2 percent={percent} fileName={fileName} fileUrl={fileUrl} />
            </CustomTabPanel>
        </Box>
    );
}

const UploadTab = () => {
    return (
        <>
            <BasicTabs />
        </>
    )
}

export default UploadTab