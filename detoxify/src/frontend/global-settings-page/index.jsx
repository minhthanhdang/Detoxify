import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Inline, xcss, HelperMessage, SectionMessage } from '@forge/react'
import { invoke } from '@forge/bridge';

import {
  Form,
  FormHeader,
  FormSection,
  FormFooter,
  Label,
  RequiredAsterisk,
  Textfield,
  Button,
  useForm
} from "@forge/react";


const appContainerStyles = xcss({
  width: '640px'
})

const formStyle = xcss({
  paddingTop: 'space.100',
  paddingBottom: 'space.100',
})

const App = () => {
  const { handleSubmit, register, getFieldId } = useForm();
  const [saved, setSaved] = useState(false);

  console.log(saved)
  const login = async (data) => {
    // handle data inputs
    console.log(data);

    try {
      const res = await invoke('setAppSettings', { adminId: data.accountId });
      setSaved(true);
    } catch {
      console.error('Error while setting app settings');
    }
  };

  return (
    <>
      <Inline alignInline="center">
        <Box xcss={appContainerStyles}>
        <Form onSubmit={handleSubmit(login)}>
          <FormHeader title="Configure Detoxify">
            Required fields are marked with an asterisk <RequiredAsterisk />
          </FormHeader>
          <FormSection>
            <Label labelFor={getFieldId("accountId")}>
              Admin Account Id
              <RequiredAsterisk />
            </Label>
            <Textfield {...register("accountId", { required: true })} onFocus={()=>{setSaved(false)}}/>
            <HelperMessage>
              Log in to Admin account. Click on your Avatar -{`>`} Profile. Your Account ID is in the URL, after /people. Only admin can manage flagged comments.
            </HelperMessage>
            <Box xcss={formStyle}>          
              <Label labelFor={getFieldId("apiKey")}>
                AI service External API Key
              </Label>
              <Textfield {...register("apiKey", { required: false })} />
              <HelperMessage>
                API Key to access the external AI service. For Codegeist Hackathon, I can't find the policy to share the key with judges, so the API doesn't require an API key for now.
              </HelperMessage>
            </Box>
            {saved && <SectionMessage>Settings saved</SectionMessage>}
          </FormSection>
          <FormFooter>
            
            <Button appearance="primary" type="submit">
              Submit
            </Button>
          </FormFooter>
        </Form>
        </Box>
      </Inline>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
