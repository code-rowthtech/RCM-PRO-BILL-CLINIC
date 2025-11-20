import { memo, useRef, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';

const EncounterSummaryItem = memo(({ menuItem, content, sectionKey, scrollToAccordion }) => {
    const accordionRef = useRef(null);

    useEffect(() => {
        if (scrollToAccordion === sectionKey && accordionRef.current) {
            accordionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [scrollToAccordion, sectionKey]);

    return (
        <Accordion.Item
            ref={accordionRef}
            eventKey={menuItem?.order?.toString()}
            className="border-0 mb-2"
            data-section={sectionKey}
        >
            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                <span className='fw-semibold fs-6'>{menuItem?.name}</span>
            </Accordion.Header>
            {content}
        </Accordion.Item>
    );
});

EncounterSummaryItem.displayName = 'EncounterSummaryItem';

export default EncounterSummaryItem;
