# Designite-ts

Designite-ts scans the Angular/TypeScript code for detecting design smells or violation design principals. The Angular/TypeScript code must follow OOP approach in order to find smells.

The current version V0.1.0 can detect following 10 smells from the code:
- Imperative Abstraction
- Unnecessary Abstraction
- Deficient Encapsulation
- Broken Hierarchy
- Cyclic Hierarchy
- Deep Hierarchy
- Multipath Hierarchy
- Rebelious Hierarchy
- Wide Hierarchy
- Broken Modularization

## How to use

- Select and Right click the folder in the EXPLORER on which you want to run the tool
- Click on the 'Start Designite' menu option in context menu
- A file named designSmells.csv will be generated with the repot

![Open context menu](./assets/screen_1.png)

![Select Start Designite](./assets/screen_2.png)

## VS Code version supported
- V 1.56.0 or later

## Details and references
- It's based on DesigniteJava https://www.designite-tools.com/designitejava/
- The code is re-written from scratch in TypeScript for scanning TypeScript code.
- Refer http://www.designsmells.com/ to know more about design smells.