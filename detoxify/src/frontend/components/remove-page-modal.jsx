import React, { useState } from 'react';

import { invoke } from '@forge/bridge';

import { 
  CheckboxGroup,
  Button,
  Text
} from '@forge/react';

import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Strong } from '@forge/react';

export const RemovePageModal = ({ pages , closeModal }) => {
  const [value, setValue] = useState([]);
  const [isPending, setIsPending] = useState(false);

  const submit = async () => {
    if (!value.length) {
      return;
    }
    setIsPending(true);
    await invoke('removePages', { pages: value });
    closeModal();
  }

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Add pages to protected list</ModalTitle>
      </ModalHeader>
      <ModalBody>
        {pages && 
          <CheckboxGroup
            name="myCheckbox"
            options={pages.map((page) => ({
              label: page.title,
              value: page.id,
            }))}
            onChange={setValue}
          />              
        }
        {!pages && <Text>All pages have been protected.</Text>}
      </ModalBody>
      <ModalFooter>
        <Button appearance="subtle" onClick={closeModal} isDisabled={isPending}>
          Cancel
        </Button>
        {pages &&
          <Button appearance="danger" onClick={submit} isDisabled={isPending}>
            Remove
          </Button>
        }
      </ModalFooter>
    </Modal>
  )
}