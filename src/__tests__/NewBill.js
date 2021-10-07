import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import fireStoreMock from "../__mocks__/firebase"
import firestore from "../app/Firestore"
import { localStorageMock } from "../__mocks__/localStorage.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test ("Then newbill should have those values", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const billResult = new NewBill({document : document, onNavigate : "dummy", firestore : fireStoreMock, localStorage:localStorage})
      expect(billResult.onNavigate).toEqual("dummy")
      expect(billResult.document).toEqual(document)
      expect(billResult.firestore).toEqual(fireStoreMock)
    })
    test("Then if the file is changed and has an invalid extension", () => {

      const billUI = NewBillUI()
      document.body.innerHTML = billUI
      const billResult = new NewBill({document : document, onNavigate : "dummy", firestore : fireStoreMock, localStorage:localStorage})
      billResult.handleChangeFile({target : {"value" : "test.invalid"}})
    })
    test("Then if the file is changed and has a valid extension", () => {

      const billUI = NewBillUI()
      document.body.innerHTML = billUI
      const billResult = new NewBill({document : document, onNavigate : "dummy", firestore : fireStoreMock, localStorage:localStorage})
      billResult.handleChangeFile({target : {"value" : "test.jpg"}})
      expect(billResult.fileUrl).toEqual("test")
      //not OK yet, there seems to be an issue with the chaining of promises
    })
    test("If the form is submitted", () => {

      //defining current User email
      Object.defineProperty(window, 'localStorage', {value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        email: 'test@test.com'
      }))

      const billUI = NewBillUI()
      document.body.innerHTML = billUI
      const billResult = new NewBill({document : document, onNavigate : () => {true}, firestore : firestore, localStorage:localStorage})
      //Spying on the createBill Method to check if it has been called
      let spy = jest.spyOn(billResult, 'createBill').mockImplementation(() => true);

      //Calling the form submission method
      billResult.handleSubmit({target : screen.getByTestId("form-new-bill"), preventDefault: () => {return false}})
      //checking if the Spy on CreateBill has been called
      expect(spy).toHaveBeenCalled()
    })
  })
})