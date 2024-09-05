extends RefCounted
"""
Information about a particular launcher/gun that updates frequently (current state)
"""

## What is this gun currently shooting at?
var current_target: String

## Is this gun currently engaging a target
## This can be:
##  - "idle"
##  - "tracking"
##  - "loading"
##  - "firing"
var state: String

## How many more rounds of ammunitino does this gun contain?
var ammo: int
