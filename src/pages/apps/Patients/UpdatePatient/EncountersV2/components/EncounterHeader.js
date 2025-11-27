import { memo } from 'react';
import { Button } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import { HiMiniBars3BottomLeft } from 'react-icons/hi2';
import { CiSettings } from 'react-icons/ci';
import { BiCollapse, BiExpand } from 'react-icons/bi';
import { MdPrint, MdSave } from 'react-icons/md';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { formatDate } from '../../../../../../helpers/dateFormat';
import { useSelector } from 'react-redux';

const EncounterHeader = memo(({
    encounterTabs,
    activeTab,
    removeEncounterTab,
    expanded,
    setExpanded,
    toggleCollapse,
    showSettings,
    setShowSettings,
    expandAllAccordions,
    setExpandAllAccordions,
    setIsCollapsed,
    handlePrint,
    handleReadyForBilling,
    onEncounterTabClick
}) => {
    const activeTabData = encounterTabs.find(tab => tab.id === activeTab);
    const isFormTab = activeTabData?.type !== 'default';
    const store = useSelector((state) => state);
    return (
        <div className="col-12 d-flex align-items-center justify-content-between px-2" style={{ height: 'fit-content' }}>
            <div className="d-flex align-items-center">
                {encounterTabs?.length > 1 && (
                    <>
                        <HiMiniBars3BottomLeft
                            onClick={toggleCollapse}
                            className='fw-bold fs-4 mx-1 cursor-pointer text-black' />
                        <CiSettings
                            onClick={() => setShowSettings(!showSettings)}
                            className='fw-bold fs-4 mx-1 cursor-pointer text-black' />
                    </>
                )}
                {encounterTabs?.map((tab) => (
                    <div
                        key={tab?.id}
                        className={`${encounterTabs?.length > 1 ? 'cursor-pointer' : ''}  p-1 fs-6 rounded-0 list-group-item  
                                d-flex align-items-center flex-fill justify-content-center fw-bold 
                                 ${activeTab === tab?.id ? 'active-patient-chart-tab fw-medium border border-muted' : 'border border-muted'}`}
                        onClick={() => onEncounterTabClick(tab)}
                    >
                        <span className="text-nowrap">{tab?.title === 'Encounter list' ? tab?.title : formatDate(tab?.title)}</span>
                        {tab.type !== 'default' && (
                            <span
                                className="p-0 ms-2 m-0"
                                onClick={(e) => removeEncounterTab(tab?.id, e)}
                            ><IoClose /></span>
                        )}
                    </div>
                ))}
            </div>
            <div className="d-flex align-items-center gap-2">
                {isFormTab && (
                    <>
                        <Button
                            size="sm"
                            variant="outline-secondary"
                            className="d-flex align-items-center gap-1 px-2 py-1"
                            onClick={() => {
                                setExpandAllAccordions(!expandAllAccordions);
                                if (expandAllAccordions) {
                                    setExpanded(true);
                                    setIsCollapsed(true);
                                } else {
                                    setIsCollapsed(false);
                                }
                            }}
                            title={expandAllAccordions ? 'Minimize All' : 'Expand All'}
                        >
                            <span className="small">{expandAllAccordions ? 'Minimize All' : 'Expand All'}</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-primary"
                            className="d-flex align-items-center gap-1 px-2 py-1"
                            onClick={handlePrint}
                            title="Print"
                        >
                            <MdPrint size={18} />
                            <span className="small">Print</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-success"
                            className="d-flex align-items-center gap-1 px-2 py-1"
                            form="encounter-form"
                            type="submit"
                            title="Save"
                            disabled={store?.createEncounterReducer?.loading || store?.updateEncounterReducer?.loading}
                        >
                            <MdSave size={18} />
                            <span className="small">Save</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-info"
                            className="d-flex align-items-center gap-1 px-2 py-1"
                            onClick={handleReadyForBilling}
                            title="Ready for Billing"
                        >
                            <FaFileInvoiceDollar size={16} />
                            <span className="small">Billing</span>
                        </Button>
                    </>
                )}
                {expanded ?
                    <BiCollapse className='text-primary fw-bold fs-4 cursor-pointer' onClick={() => setExpanded(!expanded)} />
                    :
                    <BiExpand className='text-primary fw-bold fs-4 cursor-pointer' onClick={() => setExpanded(!expanded)} />
                }
            </div>
        </div>
    );
});

EncounterHeader.displayName = 'EncounterHeader';

export default EncounterHeader;
