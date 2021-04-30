import React, { useState, useEffect } from "react";

import {
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import ModalHeaderWithCloseBtn from "../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";
import TablesInModal from "../TablesInModal/TablesInModal";

import { toastError, toastSuccessLeft } from "../../../utils/toastUtils";
import billApi from "../../../api/billApi";
import areaApi from "../../../api/areaApi";

const ChangeTableModal = ({
  show,
  toggle,
  tables,
  billsByTable,
  currentTable,
  handleChangeTable,
}) => {
  const [changeTable, setChangeTable] = useState(0);
  const [areas, setAreas] = useState([]);
  const [selectArea, setSelectArea] = useState("");

  useEffect(() => {
    if (!show) return;
    const fetchAreas = async () => {
      try {
        const res = await areaApi.getAll();
        setAreas(res.data);
        setSelectArea(String(currentTable.area?.id));
      } catch (ex) {
        toastError("Lấy thông tin thất bại, vui lòng thử lại sau");
      }
    };
    fetchAreas();
  }, [show, currentTable]);

  const doToggle = () => {
    setChangeTable(0);
    toggle();
  };

  const isSelected = (tableId) => tableId === changeTable;

  const handleSelectTable = (tableId) => {
    setChangeTable(tableId === currentTable.id ? 0 : tableId);
  };

  const handleSubmitChangeTable = async () => {
    try {
      const oldTableId = currentTable.id;
      const billId = billsByTable[currentTable.id].id;
      const res = await billApi.changeTable(billId, changeTable);
      handleChangeTable(res.data, oldTableId, changeTable);
      doToggle();
      toastSuccessLeft("Chuyển bàn thành công");
    } catch (ex) {
      toastError("Chuyển bàn thất bại: " + ex.response?.data?.message);
    }
  };

  return (
    <Modal
      className="modal-lg modal-dialog-scrollable"
      isOpen={show}
      toggle={doToggle}
    >
      <ModalHeaderWithCloseBtn toggle={doToggle}>
        Chuyển bàn {currentTable.name}
      </ModalHeaderWithCloseBtn>
      <ModalBody className="bg-white">
        {show && (
          <>
            <div className="mb-2">
              <Form inline onSubmit={(e) => e.preventDefault()}>
                <FormGroup>
                  <Label for="area" className="mr-2">
                    Chọn khu vực:
                  </Label>
                  <Input
                    type="select"
                    name="area"
                    value={selectArea}
                    onChange={(e) => setSelectArea(e.target.value)}
                  >
                    {areas.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Form>
            </div>
            <TablesInModal
              tables={tables}
              billsByTable={billsByTable}
              currentTableId={currentTable.id}
              selectedAreaId={Number(selectArea)}
              selector={isSelected}
              onClick={handleSelectTable}
            />
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="light" onClick={doToggle}>
          Hủy
        </Button>
        <Button
          disabled={changeTable === 0}
          color="warning"
          onClick={handleSubmitChangeTable}
        >
          Chuyển bàn
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ChangeTableModal;
