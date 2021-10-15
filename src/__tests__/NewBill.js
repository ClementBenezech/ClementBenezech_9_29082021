import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import fireStoreMock from "../__mocks__/firebase"
import firestore from "../app/Firestore"
import { localStorageMock } from "../__mocks__/localStorage.js"
import userEvent from '@testing-library/user-event'


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

      /*const billUI = NewBillUI()
      document.body.innerHTML = billUI
      const billResult = new NewBill({document : document, onNavigate : "dummy", firestore : fireStoreMock, localStorage:localStorage})
      billResult.handleChangeFile({target : {"value" : "test.invalid"}})*/

      //Initializing BillUI
      const billUI = NewBillUI()
      document.body.innerHTML = billUI
      //Creating dummy file to be uploaded
      const file = new File(['hello'], 'hello.bad', {type: 'image/bad'})
      //Getting file input from DOM
      const fileInput = screen.getByTestId("file")
      //Uploading File as a user would do
      userEvent.upload(fileInput, file)

      //Applying handleChangeFile Method
      const billResult = new NewBill({document : document, onNavigate : "dummy", firestore : fireStoreMock, localStorage:localStorage})
      billResult.handleChangeFile({target : {"value" : fileInput.files[0].name}})

      //Checking if file has been blocked due to bad extension
      expect(fileInput.value).toBe("")
    })
    test("Then if the file is changed and has a valid extension", () => {

      //Initializing BillUI
      const billUI = NewBillUI()
      document.body.innerHTML = billUI
      //Creating dummy file to be uploaded
      const file = new File(['hello'], 'hello.png', {type: 'image/png'})
      //Getting file input from DOM
      const fileInput = screen.getByTestId("file")
      //Uploading File as a user would do
      userEvent.upload(fileInput, file)

      const billResult = new NewBill({document : document, onNavigate : "dummy", firestore : fireStoreMock, localStorage:localStorage})
      billResult.handleChangeFile({target : {"value" : fileInput.files[0].name}})

      //Checking if file has been uploaded
      expect(fileInput.files[0].name).toBe("hello.png")

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
      //POST TESTS
    test("Fetches response from mock API post with valid Data", async () => {
        const getSpy = jest.spyOn(fireStoreMock, "post")
        const response = await fireStoreMock.post("validData")
        expect(getSpy).toHaveBeenCalledTimes(1)
        expect(response.data[0].response).toBe('200')
    })

    test("Fetches response from mock API post should get 500 internal error code", async () => {
        const getSpy = jest.spyOn(fireStoreMock, "post")
        const response = await fireStoreMock.post("internalError")
        expect(getSpy).toHaveBeenCalledTimes(2)
        expect(response.data[0].response).toBe('500')
    })

    test("Fetches response from mock API post and get not found 404", async () => {
      const getSpy = jest.spyOn(fireStoreMock, "post")
      const response = await fireStoreMock.post("notFound")
      expect(getSpy).toHaveBeenCalledTimes(3)
      expect(response.data[0].response).toBe('404')
    })
  })
})