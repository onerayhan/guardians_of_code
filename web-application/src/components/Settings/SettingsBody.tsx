import ChangePassword from "../Settings/ChangePassword"
import ChangeEmail from "../Settings/ChangeEmail"
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'

const SettingsBody = () =>
{
    return (
        <div className="bg-[#081730]">
            <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <h2 className="text-white">Change Password</h2>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <ChangePassword/>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <h2 className="text-white">Change Email</h2>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <ChangeEmail/>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
export default SettingsBody;