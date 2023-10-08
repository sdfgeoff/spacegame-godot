extends RefCounted
"""
Information about a particular launcher/gun
"""

## What type of launcher is this? This generally indicates what type of
## ammunition it firest (Eg minigun, missile launcher)
var type: String

## What is this gun currently shooting at?
var current_target: String

## Is this gun currently engaging a target
var active: bool

## How many more rounds of ammunitino does this gun contain?
var ammo: int
