Given [ Placed(0,0,X), Placed(0,1,X) ]
When  [ Place(0,2,X) ]
Then  [ Won(X) ]

Given [ Placed(0,0,X), Placed(1,0,X) ]
When  [ Place(2,0,X) ]
Then  [ Won(X) ]

Given [ Placed(0,0,X), Placed(1,1,X) ]
When  [ Place(2,2,X) ]
Then  [ Won(X) ]

Given [ Placed(2,0,X), Placed(1,1,X) ]
When  [ Place(0,2,X) ]
Then  [ Won(X) ]

Given [ Placed(0,0,X), Placed(0,1,X) ]
When  [ Place(0,0,Y) ]
Then  [ Illegal(0,0,Y) ]

Given [ Placed(0,0,X), Placed(0,1,X), Placed(0,2,Y), Placed(1,0,X), Placed(1,1,X), Placed(1,2,Y), Placed(2,0,Y), Placed(2,1,Y) ]
When  [ Place(2,2,X) ]
Then  [ Draw(0,0,Y) ]
