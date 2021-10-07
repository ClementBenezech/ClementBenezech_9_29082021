import { screen, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import LoadingPage from "../views/LoadingPage.js"
import ErrorPage from "../views/ErrorPage"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firestore from "../app/Firestore.js"
import fireStoreMock from "../__mocks__/firebase"
import { ROUTES, ROUTES_PATH } from '../constants/routes.js'
import Router  from "../app/Router.js"
import Bill from "../containers/Bills"
import "../../setup-jest"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

          //Handling firestore behavior IS IT THE SOLUTION TO MOCK GETURL IN NEWBILL?
          jest.mock("../app/Firestore");
          firestore.bills = () => ({bills, get: jest.fn().mockResolvedValue()})
    
          //defining current User
          Object.defineProperty(window, 'localStorage', {value: localStorageMock })
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
          }))
    
          //Defining current page
          Object.defineProperty(window, "location", {value : {hash : ROUTES_PATH['Bills'], href: "http://test.com/" } } )

      test("Then bill icon in vertical layout should be highlighted", () => {
      /*const html = BillsUI({ data: []})
      document.body.innerHTML = html*/

      //Creating HTML container, , then launching router
      document.body.innerHTML = "<div id ='root'></div>"
      Router();
      expect(screen.getByTestId("icon-window").className).toEqual("active-icon")
    })
      test("Then if icon eye is clicked, route is newBill", () => {

      //Initializing page by calling the router
      document.body.innerHTML = "<div id ='root'></div>"
      Router();
      //then initializing billsUI
      const html = BillsUI({ data: bills })
      //Putting BillsUi in the page content
      document.getElementsByClassName("content")[0].innerHTML = html

      //Initializing one bill object to be able to summon handleClickNewBill
      const someBill = new Bill({document : document, onNavigate : onNavigate, firestore : fireStoreMock, localStorage:localStorage})
      
      someBill.handleClickNewBill()

      //Checking if new bill form exists
      expect(screen.queryByTestId('form-new-bill').textContent).toBeTruthy()

    })
    test("Then if icon eye is clicked, it opens the modale", () => {
      //Initializing page by calling the router

      document.body.innerHTML = "<div id ='root'></div>"
      Router();
      //then initializing billsUI
      const html = BillsUI({ data: bills })
      //Putting BillsUi in the page content
      document.getElementsByClassName("content")[0].innerHTML = html

      /*getting one of the active eye icons on the page*/
      //returns an eye-icon object from the dom. This statement works, returns
      const icon = document.getElementById("eye")

      console.log(icon.id)
      //The modale exists in the DOM
      console.log(document.getElementById("modaleFile").id)

      //Initializing one bill object to be able to summon handleClickIconEye
      const someBill = new Bill({document : document, onNavigate : () => {return true}, firestore : fireStoreMock, localStorage:localStorage})
      someBill.handleClickIconEye(icon)
      expect(screen.queryByTestId('modaleFile').classList).toContain('show');

      //Method 1: simulating click on the eye, expecting modale to become visible
      //const iconEye = screen.queryAllByTestId("icon-eye")[0]
      //fireEvent.click(iconEye);
    })

    test("Then if there is an error, it is returned", () => {
      const errorResult= BillsUI({ data: [], loading: false, error: true})
      expect(errorResult).toEqual(ErrorPage(true))
    })

    test("Then the UI is loading, loadingPage is returned", () => {
      const loadingResult = BillsUI({ data: [], loading: true, error: "false"})
      expect(loadingResult).toEqual(LoadingPage())
    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})