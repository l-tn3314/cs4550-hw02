# cs4550-hw02


## The Calculator
The calculator starts off with a display of '0'. Clicking any of the calculator buttons will change the 
color of the button clicked, as an indicator that the button has been clicked. 

This README assumes basic knowledge of how a calculator operates. Some details of the calculator 
functionality will be explained below.

- This calculator does not display leading zeros (eg: '001' is displayed as '1' and '0.1' is displayed as '.1')
- This calculator only displays a single number at a time (eg: it would not display '1+2', instead only '2' would be displayed)
- If the decimal button is clicked while the current number already has a decimal, nothing happens
(eg: the sequence '1', '.', '2', '.', '3' would display '1.23' )
- If two operators are consecutively clicked, the calculator displays 'Err' (eg: the sequence '1', '+', '*') 
- This calculator *does not* support inputting negative numbers. So the sequence '3', '+', '-', '2' *would not* be 
supported, as the calculator would interpret that as two consecutive operators and display 'Err'
- Chaining is supported; so with the inputs '5', '+=', '6', '-', '3', '+=', the corresponding calculator
displays would be '5', '5', '6', '11', '3', '8'.
