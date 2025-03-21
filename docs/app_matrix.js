    // ------------------------------------------------------------
    // 1) TRIZ PARAMETERS (39 parameters)
    // ------------------------------------------------------------
    const parameters = [
        "Weight of moving object",
        "Weight of stationary object",
        "Length of moving object",
        "Length of stationary object",
        "Area of moving object",
        "Area of stationary object",
        "Volume of moving object",
        "Volume of stationary object",
        "Speed",
        "Force (Intensity)",
        "Stress or pressure",
        "Shape",
        "Stability of the object",
        "Strength",
        "Durability of moving object",
        "Durability of non moving object",
        "Temperature",
        "Illumination intensity",
        "Use of energy by moving object",
        "Use of energy by stationary object",
        "Power",
        "Loss of Energy",
        "Loss of substance",
        "Loss of Information",
        "Loss of Time",
        "Quantity of substance/the matter",
        "Reliability",
        "Measurement accuracy",
        "Manufacturing precision",
        "Object-affected harmful factors",
        "Object-generated harmful factors",
        "Ease of manufacture",
        "Ease of operation",
        "Ease of repair",
        "Adaptability or versatility",
        "Device complexity",
        "Difficulty of detecting and measuring",
        "Extent of automation",
        "Productivity"
      ];
  
      // ------------------------------------------------------------
      // 2) TRIZ PRINCIPLES (40 principles)
      // ------------------------------------------------------------
      const principlesList = [
        "Segmentation",
        "Taking out",
        "Local quality",
        "Asymmetry",
        "Merging",
        "Universality",
        "Nested doll",
        "Anti-weight",
        "Preliminary anti-action",
        "Preliminary action",
        "Beforehand cushioning",
        "Equipotentiality",
        "The other way round",
        "Spheroidality/Curvature",
        "Dynamics",
        "Partial or excessive actions",
        "Another dimension",
        "Mechanical vibration",
        "Periodic action",
        "Continuity of useful action",
        "Skipping",
        "Blessing in disguise",
        "Feedback",
        "Intermediary",
        "Self-service",
        "Copying",
        "Cheap short-living objects",
        "Mechanics substitution",
        "Pneumatics and hydraulics",
        "Flexible shells and thin films",
        "Porous materials",
        "Color changes",
        "Homogeneity",
        "Discarding and recovering",
        "Parameter changes",
        "Phase transitions",
        "Thermal expansion",
        "Strong oxidants",
        "Inert atmosphere",
        "Composite materials"
      ];
  
      // ------------------------------------------------------------
      // 3) FULL TRIZ CONTRADICTION MATRIX DATA
      //    (array of arrays, each cell has comma-separated principle indices)
      // ------------------------------------------------------------
    const matrixData = [
        ["•","•","15, 8, 29, 34","•","29, 17, 38, 34","•","29, 2, 40, 28","•","2, 8, 15, 38","8, 10, 18, 37","10, 36, 37, 40","10, 14, 35, 40","1, 35, 19, 39","28, 27, 18, 40","5, 34, 31, 35","•","6, 29, 4, 38","19, 1, 32","35, 12, 34, 31","•","12, 36, 18, 31","6, 2, 34, 19","5, 35, 3, 31","10, 24, 35","10, 35, 20, 28","3, 26, 18, 31","1, 3, 11, 27","28, 27, 35, 26","28, 35, 26, 18","22, 21, 18, 27","22, 35, 31, 39","27, 28, 1, 36","35, 3, 2, 24","2, 27, 28, 11","29, 5, 15, 8","26, 30, 36, 34","28, 29, 26, 32","26, 35, 18, 19","35, 3, 24, 37"],
        ["•","•","•","10, 1, 29, 35","•","35, 30, 13, 2","•","5, 35, 14, 2","•","8, 10, 19, 35","13, 29, 10, 18","13, 10, 29, 14","26, 39, 1, 40","28, 2, 10, 27","•","2, 27, 19, 6","28, 19, 32, 22","19, 32, 35","•","18, 19, 28, 1","15, 19, 18, 22","18, 19, 28, 15","5, 8, 13, 30","10, 15, 35","10, 20, 35, 26","19, 6, 18, 26","10, 28, 8, 3","18, 26, 28","10, 1, 35, 17","2, 19, 22, 37","35, 22, 1, 39","28, 1, 9","6, 13, 1, 32","2, 27, 28, 11","19, 15, 29","1, 10, 26, 39","25, 28, 17, 15","2, 26, 35","1, 28, 15, 35"],
        ["8, 15, 29, 34","•","•","•","15, 17, 4","•","7, 17, 4, 35","•","13, 4, 8","17, 10, 4","1, 8, 35","1, 8, 10, 29","1, 8, 15, 34","8, 35, 29, 34","19","•","10, 15, 19","32","8, 35, 24","•","1, 35","7, 2, 35, 39","4, 29, 23, 10","1, 24","15, 2, 29","29, 35","10, 14, 29, 40","28, 32, 4","10, 28, 29, 37","1, 15, 17, 24","17, 15","1, 29, 17","15, 29, 35, 4","1, 28, 10","14, 15, 1, 16","1, 19, 26, 24","35, 1, 26, 24","17, 24, 26, 16","14, 4, 28, 29"],
        ["•","35, 28, 40, 29","•","•","•","17, 7, 10, 40","•","35, 8, 2, 14","•","28, 10","1, 14, 35","13, 14, 15, 7","39, 37, 35","15, 14, 28, 26","•","1, 10, 35","3, 35, 38, 18","3, 25","•","•","12, 8","6, 28","10, 28, 24, 35","24, 26","30, 29, 14","•","15, 29, 28","32, 28, 3","2, 32, 10","1, 18","•","15, 17, 27","2, 25","3","1, 35","1, 26","26","•","30, 14, 7, 26"],
        ["2, 17, 29, 4","•","14, 15, 18, 4","•","•","•","7, 14, 17, 4","•","29, 30, 4, 34","19, 30, 35, 2","10, 15, 36, 28","5, 34, 29, 4","11, 2, 13, 39","3, 15, 40, 14","6, 3","•","2, 15, 16","15, 32, 19, 13","19, 32","•","19, 10, 32, 18","15, 17, 30, 26","10, 35, 2, 39","30, 26","26, 4","29, 30, 6, 13","29, 9","26, 28, 32, 3","2, 32","22, 33, 28, 1","17, 2, 18, 39","13, 1, 26, 24","15, 17, 13, 16","15, 13, 10, 1","15, 30","14, 1, 13","2, 36, 26, 18","14, 30, 28, 23","10, 26, 34, 2"],
        ["•","30, 2, 14, 18","•","26, 7, 9, 39","•","•","•","•","•","1, 18, 35, 36","10, 15, 36, 37","•","2, 38","40","•","2, 10, 19, 30","35, 39, 38","•","•","•","17, 32","17, 7, 30","10, 14, 18, 39","30, 16","10, 35, 4, 18","2, 18, 40, 4","32, 35, 40, 4","26, 28, 32, 3","2, 29, 18, 36","27, 2, 39, 35","22, 1, 40","40, 16","16, 4","16","15, 16","1, 18, 36","2, 35, 30, 18","23","10, 15, 17, 7"],
        ["2, 26, 29, 40","•","1, 7, 4, 35","•","1, 7, 4, 17","•","•","•","29, 4, 38, 34","15, 35, 36, 37","6, 35, 36, 37","1, 15, 29, 4","28, 10, 1, 39","9, 14, 15, 7","6, 35, 4","•","34, 39, 10, 18","2, 13, 10","35","•","35, 6, 13, 18","7, 15, 13, 16","36, 39, 34, 10","2, 22","2, 6, 34, 10","29, 30, 7","14, 1, 40, 11","25, 26, 28","25, 28, 2, 16","22, 21, 27, 35","17, 2, 40, 1","29, 1, 40","15, 13, 30, 12","10","15, 29","26, 1","29, 26, 4","35, 34, 16, 24","10, 6, 2, 34"],
        ["•","35, 10, 19, 14","19, 14","35, 8, 2, 14","•","•","•","•","•","2, 18, 37","24, 35","7, 2, 35","34, 28, 35, 40","9, 14, 17, 15","•","35, 34, 38","35, 6, 4","•","•","•","30, 6","•","10, 39, 35, 34","•","35, 16, 32, 18","35, 3","2, 35, 16","•","35, 10, 25","34, 39, 19, 27","30, 18, 35, 4","35","•","1","•","1, 31","2, 17, 26","•","35, 37, 10, 2"],
        ["2, 28, 13, 38","•","13, 14, 8","•","29, 30, 34","•","7, 29, 34","•","•","13, 28, 15, 19","6, 18, 38, 40","35, 15, 18, 34","28, 33, 1, 18","8, 3, 26, 14","3, 19, 35, 5","•","28, 30, 36, 2","10, 13, 19","8, 15, 35, 38","•","19, 35, 38, 2","14, 20, 19, 35","10, 13, 28, 38","13, 26","•","10, 19, 29, 38","11, 35, 27, 28","28, 32, 1, 24","10, 28, 32, 25","1, 28, 35, 23","2, 24, 35, 21","35, 13, 8, 1","32, 28, 13, 12","34, 2, 28, 27","15, 10, 26","10, 28, 4, 34","3, 34, 27, 16","10, 18",""],
        ["8, 1, 37, 18","18, 13, 1, 28","17, 19, 9, 36","28, 10","19, 10, 15","1, 18, 36, 37","15, 9, 12, 37","2, 36, 18, 37","13, 28, 15, 12","•","18, 21, 11","10, 35, 40, 34","35, 10, 21","35, 10, 14, 27","19, 2","•","35, 10, 21","•","19, 17, 10","1, 16, 36, 37","19, 35, 18, 37","14, 15","8, 35, 40, 5","•","10, 37, 36","14, 29, 18, 36","3, 35, 13, 21","35, 10, 23, 24","28, 29, 37, 36","1, 35, 40, 18","13, 3, 36, 24","15, 37, 18, 1","1, 28, 3, 25","15, 1, 11","15, 17, 18, 20","26, 35, 10, 18","36, 37, 10, 19","2, 35","3, 28, 35, 37"],
        ["10, 36, 37, 40","13, 29, 10, 18","35, 10, 36","35, 1, 14, 16","10, 15, 36, 28","10, 15, 36, 37","6, 35, 10","35, 24","6, 35, 36","36, 35, 21","•","35, 4, 15, 10","35, 33, 2, 40","9, 18, 3, 40","19, 3, 27","•","35, 39, 19, 2","•","14, 24, 10, 37","•","10, 35, 14","2, 36, 25","10, 36, 3, 37","•","37, 36, 4","10, 14, 36","10, 13, 19, 35","6, 28, 25","3, 35","22, 2, 37","2, 33, 27, 18","1, 35, 16","11","2","35","19, 1, 35","2, 36, 37","35, 24","10, 14, 35, 37"],
        ["8, 10, 29, 40","15, 10, 26, 3","29, 34, 5, 4","13, 14, 10, 7","5, 34, 4, 10","•","14, 4, 15, 22","7, 2, 35","35, 15, 34, 18","35, 10, 37, 40","34, 15, 10, 14","•","33, 1, 18, 4","30, 14, 10, 40","14, 26, 9, 25","•","22, 14, 19, 32","13, 15, 32","2, 6, 34, 14","•","4, 6, 2","14","35, 29, 3, 5","•","14, 10, 34, 17","36, 22","10, 40, 16","28, 32, 1","32, 30, 40","22, 1, 2, 35","35, 1","1, 32, 17, 28","32, 15, 26","2, 13, 1","1, 15, 29","16, 29, 1, 28","15, 13, 39","15, 1, 32","17, 26, 34, 10"],
        ["21, 35, 2, 39","26, 39, 1, 40","13, 15, 1, 28","37","2, 11, 13","39","28, 10, 19, 39","34, 28, 35, 40","33, 15, 28, 18","10, 35, 21, 16","2, 35, 40","22, 1, 18, 4","•","17, 9, 15","13, 27, 10, 35","39, 3, 35, 23","35, 1, 32","32, 3, 27, 16","13, 19","27, 4, 29, 18","32, 35, 27, 31","14, 2, 39, 6","2, 14, 30, 40","•","35, 27","15, 32, 35","•","13","18","35, 24, 30, 18","35, 40, 27, 39","35, 19","32, 35, 30","2, 35, 10, 16","35, 30, 34, 2","2, 35, 22, 26","35, 22, 39, 23","1, 8, 35","23, 35, 40, 3"],
        ["1, 8, 40, 15","40, 26, 27, 1","1, 15, 8, 35","15, 14, 28, 26","3, 34, 40, 29","9, 40, 28","10, 15, 14, 7","9, 14, 17, 15","8, 13, 26, 14","10, 18, 3, 14","10, 3, 18, 40","10, 30, 35, 40","13, 17, 35","•","27, 3, 26","•","30, 10, 40","35, 19","19, 35, 10","35","10, 26, 35, 28","35","35, 28, 31, 40","•","29, 3, 28, 10","29, 10, 27","11, 3","3, 27, 16","3, 27","18, 35, 37, 1","15, 35, 22, 2","11, 3, 10, 32","32, 40, 25, 2","27, 11, 3","15, 3, 32","2, 13, 25, 28","27, 3, 15, 40","15","29, 35, 10, 14"],
        ["19, 5, 34, 31","•","2, 19, 9","•","3, 17, 19","•","10, 2, 19, 30","•","3, 35, 5","19, 2, 16","19, 3, 27","14, 26, 28, 25","13, 3, 35","27, 3, 10","•","•","19, 35, 39","2, 19, 4, 35","28, 6, 35, 18","•","19, 10, 35, 38","•","28, 27, 3, 18","10","20, 10, 28, 18","3, 35, 10, 40","11, 2, 13","3","3, 27, 16, 40","22, 15, 33, 28","21, 39, 16, 22","27, 1, 4","12, 27","29, 10, 27","1, 35, 13","10, 4, 29, 15","19, 29, 39, 35","6, 10","35, 17, 14, 19"],
        ["•","6, 27, 19, 16","•","1, 40, 35","•","•","•","35, 34, 38","•","•","•","•","39, 3, 35, 23","•","•","•","19, 18, 36, 40","•","•","•","16","•","27, 16, 18, 38","10","28, 20, 10, 16","3, 35, 31","34, 27, 6, 40","10, 26, 24","•","17, 1, 40, 33","22","35, 10","1","1","2","•","25, 34, 6, 35","1","20, 10, 16, 38"],
        ["36, 22, 6, 38","22, 35, 32","15, 19, 9","15, 19, 9","3, 35, 39, 18","35, 38","34, 39, 40, 18","35, 6, 4","2, 28, 36, 30","35, 10, 3, 21","35, 39, 19, 2","14, 22, 19, 32","1, 35, 32","10, 30, 22, 40","19, 13, 39","19, 18, 36, 40","•","32, 30, 21, 16","19, 15, 3, 17","•","2, 14, 17, 25","21, 17, 35, 38","21, 36, 29, 31","•","35, 28, 21, 18","3, 17, 30, 39","19, 35, 3, 10","32, 19, 24","24","22, 33, 35, 2","22, 35, 2, 24","26, 27","26, 27","4, 10, 16","2, 18, 27","2, 17, 16","3, 27, 35, 31","26, 2, 19, 16","15, 28, 35"],
        ["19, 1, 32","2, 35, 32","19, 32, 16","•","19, 32, 26","•","2, 13, 10","•","10, 13, 19","26, 19, 6","•","32, 30","32, 3, 27","35, 19","2, 19, 6","•","32, 35, 19","•","32, 1, 19","32, 35, 1, 15","32","13, 16, 1, 6","13, 1","1, 6","19, 1, 26, 17","1, 19","•","11, 15, 32","3, 32","15, 19","35, 19, 32, 39","19, 35, 28, 26","28, 26, 19","15, 17, 13, 16","15, 1, 19","6, 32, 13","32, 15","2, 26, 10","2, 25, 16"],
        ["12, 18, 28, 31","•","12, 28","•","15, 19, 25","•","35, 13, 18","•","8, 35","16, 26, 21, 2","23, 14, 25","12, 2, 29","19, 13, 17, 24","5, 19, 9, 35","28, 35, 6, 18","•","19, 24, 3, 14","2, 15, 19","•","•","6, 19, 37, 18","12, 22, 15, 24","35, 24, 18, 5","•","35, 38, 19, 18","34, 23, 16, 18","19, 21, 11, 27","3, 1, 32","•","1, 35, 6, 27","2, 35, 6","28, 26, 30","19, 35","1, 15, 17, 28","15, 17, 13, 16","2, 29, 27, 28","35, 38","32, 2","12, 28, 35"],
        ["•","19, 9, 6, 27","•","•","•","•","•","•","•","36, 37","•","•","27, 4, 29, 18","35","•","•","•","19, 2, 35, 32","•","•","•","•","28, 27, 18, 31","•","•","3, 35, 31","10, 36, 23","•","•","10, 2, 22, 37","19, 22, 18","1, 4","•","•","•","•","19, 35, 16, 25","•","1, 6"],
        ["8, 36, 38, 31","19, 26, 17, 27","1, 10, 35, 37","•","19, 38","17, 32, 13, 38","35, 6, 38","30, 6, 25","15, 35, 2","26, 2, 36, 35","22, 10, 35","29, 14, 2, 40","35, 32, 15, 31","26, 10, 28","19, 35, 10, 38","16","2, 14, 17, 25","16, 6, 19","16, 6, 19, 37","•","•","10, 35, 38","28, 27, 18, 38","10, 19","35, 20, 10, 6","4, 34, 19","19, 24, 26, 31","32, 15, 2","32, 2","19, 22, 31, 2","2, 35, 18","26, 10, 34","26, 35, 10","35, 2, 10, 34","19, 17, 34","20, 19, 30, 34","19, 35, 16","28, 2, 17","28, 35, 34"],
        ["15, 6, 19, 28","19, 6, 18, 9","7, 2, 6, 13","6, 38, 7","15, 26, 17, 30","17, 7, 30, 18","7, 18, 23","7","16, 35, 38","36, 38","•","•","14, 2, 39, 6","26","•","•","19, 38, 7","1, 13, 32, 15","•","•","3, 38","•","35, 27, 2, 37","19, 10","10, 18, 32, 7","7, 18, 25","11, 10, 35","32","•","21, 22, 35, 2","21, 35, 2, 22","•","35, 32, 1","2, 19","•","7, 23","35, 3, 15, 23","2","28, 10, 29, 35"],
        ["35, 6, 23, 40","35, 6, 22, 32","14, 29, 10, 39","10, 28, 24","35, 2, 10, 31","10, 18, 39, 31","1, 29, 30, 36","3, 39, 18, 31","10, 13, 28, 38","14, 15, 18, 40","3, 36, 37, 10","29, 35, 3, 5","2, 14, 30, 40","35, 28, 31, 40","28, 27, 3, 18","27, 16, 18, 38","21, 36, 39, 31","1, 6, 13","35, 18, 24, 5","28, 27, 12, 31","28, 27, 18, 38","35, 27, 2, 31","•","•","15, 18, 35, 10","6, 3, 10, 24","10, 29, 39, 35","16, 34, 31, 28","35, 10, 24, 31","33, 22, 30, 40","10, 1, 34, 29","15, 34, 33","32, 28, 2, 24","2, 35, 34, 27","15, 10, 2","35, 10, 28, 24","35, 18, 10, 13","35, 10, 18","28, 35, 10, 23"],
        ["10, 24, 35","10, 35, 5","1, 26","26","30, 26","30, 16","•","2, 22","26, 32","•","•","•","•","•","10","10","•","19","•","•","10, 19","19, 10","•","•","24, 26, 28, 32","24, 28, 35","10, 28, 23","•","•","22, 10, 1","10, 21, 22","32","27, 22","•","•","•","35, 33","35","13, 23, 15"],
        ["10, 20, 37, 35","10, 20, 26, 5","15, 2, 29","30, 24, 14, 5","26, 4, 5, 16","10, 35, 17, 4","2, 5, 34, 10","35, 16, 32, 18","•","10, 37, 36, 5","37, 36, 4","4, 10, 34, 17","35, 3, 22, 5","29, 3, 28, 18","20, 10, 28, 18","28, 20, 10, 16","35, 29, 21, 18","1, 19, 26, 17","35, 38, 19, 18","1","35, 20, 10, 6","10, 5, 18, 32","35, 18, 10, 39","24, 26, 28, 32","•","35, 38, 18, 16","10, 30, 4","24, 34, 28, 32","24, 26, 28, 18","35, 18, 34","35, 22, 18, 39","35, 28, 34, 4","4, 28, 10, 34","32, 1, 10","35, 28","6, 29","18, 28, 32, 10","24, 28, 35, 30",""],
        ["35, 6, 18, 31","27, 26, 18, 35","29, 14, 35, 18","•","15, 14, 29","2, 18, 40, 4","15, 20, 29","•","35, 29, 34, 28","35, 14, 3","10, 36, 14, 3","35, 14","15, 2, 17, 40","14, 35, 34, 10","3, 35, 10, 40","3, 35, 31","3, 17, 39","•","34, 29, 16, 18","3, 35, 31","35","7, 18, 25","6, 3, 10, 24","24, 28, 35","35, 38, 18, 16","•","18, 3, 28, 40","13, 2, 28","33, 30","35, 33, 29, 31","3, 35, 40, 39","29, 1, 35, 27","35, 29, 25, 10","2, 32, 10, 25","15, 3, 29","3, 13, 27, 10","3, 27, 29, 18","8, 35","13, 29, 3, 27"],
        ["3, 8, 10, 40","3, 10, 8, 28","15, 9, 14, 4","15, 29, 28, 11","17, 10, 14, 16","32, 35, 40, 4","3, 10, 14, 24","2, 35, 24","21, 35, 11, 28","8, 28, 10, 3","10, 24, 35, 19","35, 1, 16, 11","•","11, 28","2, 35, 3, 25","34, 27, 6, 40","3, 35, 10","11, 32, 13","21, 11, 27, 19","36, 23","21, 11, 26, 31","10, 11, 35","10, 35, 29, 39","10, 28","10, 30, 4","21, 28, 40, 3","•","32, 3, 11, 23","11, 32, 1","27, 35, 2, 40","35, 2, 40, 26","•","27, 17, 40","1, 11","13, 35, 8, 24","13, 35, 1","27, 40, 28","11, 13, 27","1, 35, 29, 38"],
        ["32, 35, 26, 28","28, 35, 25, 26","28, 26, 5, 16","32, 28, 3, 16","26, 28, 32, 3","26, 28, 32, 3","32, 13, 6","•","28, 13, 32, 24","32, 2","6, 28, 32","6, 28, 32","32, 35, 13","28, 6, 32","28, 6, 32","10, 26, 24","6, 19, 28, 24","6, 1, 32","3, 6, 32","•","3, 6, 32","26, 32, 27","10, 16, 31, 28","•","24, 34, 28, 32","2, 6, 32","5, 11, 1, 23","•","•","28, 24, 22, 26","3, 33, 39, 10","6, 35, 25, 18","1, 13, 17, 34","1, 32, 13, 11","13, 35, 2","27, 35, 10, 34","26, 24, 32, 28","28, 2, 10, 34","10, 34, 28, 32"],
        ["28, 32, 13, 18","28, 35, 27, 9","10, 28, 29, 37","2, 32, 10","28, 33, 29, 32","2, 29, 18, 36","32, 23, 2","25, 10, 35","10, 28, 32","28, 19, 34, 36","3, 35","32, 30, 40","30, 18","3, 27","3, 27, 40","•","19, 26","3, 32","32, 2","•","32, 2","13, 32, 2","35, 31, 10, 24","•","32, 26, 28, 18","32, 30","11, 32, 1","•","•","26, 28, 10, 36","4, 17, 34, 26","•","1, 32, 35, 23","25, 10","•","26, 2, 18","•","26, 28, 18, 23","10, 18, 32, 39"],
        ["22, 21, 27, 39","2, 22, 13, 24","17, 1, 39, 4","1, 18","22, 1, 33, 28","27, 2, 39, 35","22, 23, 37, 35","34, 39, 19, 27","21, 22, 35, 28","13, 35, 39, 18","22, 2, 37","22, 1, 3, 35","35, 24, 30, 18","18, 35, 37, 1","22, 15, 33, 28","17, 1, 40, 33","22, 33, 35, 2","1, 19, 32, 13","1, 24, 6, 27","10, 2, 22, 37","19, 22, 31, 2","21, 22, 35, 2","33, 22, 19, 40","22, 10, 2","35, 18, 34","35, 33, 29, 31","27, 24, 2, 40","28, 33, 23, 26","26, 28, 10, 18","•","•","24, 35, 2","2, 25, 28, 39","35, 10, 2","35, 11, 22, 31","22, 19, 29, 40","22, 19, 29, 40","33, 3, 34","22, 35, 13, 24"],
        ["19, 22, 15, 39","35, 22, 1, 39","17, 15, 16, 22","•","17, 2, 18, 39","22, 1, 40","17, 2, 40","30, 18, 35, 4","35, 28, 3, 23","35, 28, 1, 40","2, 33, 27, 18","35, 1","35, 40, 27, 39","15, 35, 22, 2","15, 22, 33, 31","21, 39, 16, 22","22, 35, 2, 24","19, 24, 39, 32","2, 35, 6","19, 22, 18","2, 35, 18","21, 35, 2, 22","10, 1, 34","10, 21, 29","1, 22","3, 24, 39, 1","24, 2, 40, 39","3, 33, 26","4, 17, 34, 26","•","•","•","•","•","•","19, 1, 31","2, 21, 27, 1","2","22, 35, 18, 39"],
        ["28, 29, 15, 16","1, 27, 36, 13","1, 29, 13, 17","15, 17, 27","13, 1, 26, 12","16, 40","13, 29, 1, 40","35","35, 13, 8, 1","35, 12","35, 19, 1, 37","1, 28, 13, 27","11, 13, 1","1, 3, 10, 32","27, 1, 4","35, 16","27, 26, 18","28, 24, 27, 1","28, 26, 27, 1","1, 4","27, 1, 12, 24","19, 35","15, 34, 33","32, 24, 18, 16","35, 28, 34, 4","35, 23, 1, 24","•","1, 35, 12, 18","•","24, 2","•","•","2, 5, 13, 16","35, 1, 11, 9","2, 13, 15","27, 26, 1","6, 28, 11, 1","8, 28, 1","35, 1, 10, 28"],
        ["25, 2, 13, 15","6, 13, 1, 25","1, 17, 13, 12","•","1, 17, 13, 16","18, 16, 15, 39","1, 16, 35, 15","4, 18, 39, 31","18, 13, 34","28, 13, 35","2, 32, 12","15, 34, 29, 28","32, 35, 30","32, 40, 3, 28","29, 3, 8, 25","1, 16, 25","26, 27, 13","13, 17, 1, 24","1, 13, 24","•","35, 34, 2, 10","2, 19, 13","28, 32, 2, 24","4, 10, 27, 22","4, 28, 10, 34","12, 35","17, 27, 8, 40","25, 13, 2, 34","1, 32, 35, 23","2, 25, 28, 39","•","2, 5, 12","•","12, 26, 1, 32","15, 34, 1, 16","32, 26, 12, 17","•","1, 34, 12, 3","15, 1, 28"],
        ["2, 27, 35, 11","2, 27, 35, 11","1, 28, 10, 25","3, 18, 31","15, 13, 32","16, 25","25, 2, 35, 11","1","34, 9","1, 11, 10","13","1, 13, 2, 4","2, 35","11, 1, 2, 9","11, 29, 28, 27","1","4, 10","15, 1, 13","15, 1, 28, 16","•","15, 10, 32, 2","15, 1, 32, 19","2, 35, 34, 27","•","32, 1, 10, 25","2, 28, 10, 25","11, 10, 1, 16","10, 2, 13","25, 10","35, 10, 2, 16","•","1, 35, 11, 10","1, 12, 26, 15","•","7, 1, 4, 16","35, 1, 13, 11","•","34, 35, 7, 13","1, 32, 10"],
        ["1, 6, 15, 8","19, 15, 29, 16","35, 1, 29, 2","1, 35, 16","35, 30, 29, 7","15, 16","15, 35, 29","•","35, 10, 14","15, 17, 20","35, 16","15, 37, 1, 8","35, 30, 14","35, 3, 32, 6","13, 1, 35","2, 16","27, 2, 3, 35","6, 22, 26, 1","19, 35, 29, 13","•","19, 1, 29","18, 15, 1","15, 10, 2, 13","•","35, 28","3, 35, 15","35, 13, 8, 24","35, 5, 1, 10","•","35, 11, 32, 31","•","1, 13, 31","15, 34, 1, 16","1, 16, 7, 4","•","15, 29, 37, 28","1","27, 34, 35","35, 28, 6, 37"],
        ["26, 30, 34, 36","2, 26, 35, 39","1, 19, 26, 24","26","14, 1, 13, 16","6, 36","34, 26, 6","1, 16","34, 10, 28","26, 16","19, 1, 35","29, 13, 28, 15","2, 22, 17, 19","2, 13, 28","10, 4, 28, 15","•","2, 17, 13","24, 17, 13","27, 2, 29, 28","•","20, 19, 30, 34","10, 35, 13, 2","35, 10, 28, 29","•","6, 29","13, 3, 27, 10","13, 35, 1","2, 26, 10, 34","26, 24, 32","22, 19, 29, 40","19, 1","27, 26, 1, 13","27, 9, 26, 24","1, 13","29, 15, 28, 37","•","15, 10, 37, 28","15, 1, 24","12, 17, 28"],
        ["27, 26, 28, 13","6, 13, 28, 1","16, 17, 26, 24","26","2, 13, 18, 17","2, 39, 30, 16","29, 1, 4, 16","2, 18, 26, 31","3, 4, 16, 35","30, 28, 40, 19","35, 36, 37, 32","27, 13, 1, 39","11, 22, 39, 30","27, 3, 15, 28","19, 29, 39, 25","25, 34, 6, 35","3, 27, 35, 16","2, 24, 26","35, 38","19, 35, 16","18, 1, 16, 10","35, 3, 15, 19","1, 18, 10, 24","35, 33, 27, 22","18, 28, 32, 9","3, 27, 29, 18","27, 40, 28, 8","26, 24, 32, 28","•","22, 19, 29, 28","2, 21","5, 28, 11, 29","2, 5","12, 26","1, 15","15, 10, 37, 28","•","34, 21","35, 18"],
        ["28, 26, 18, 35","28, 26, 35, 10","14, 13, 17, 28","23","17, 14, 13","•","35, 13, 16","•","28, 10","2, 35","13, 35","15, 32, 1, 13","18, 1","25, 13","6, 9","•","26, 2, 19","8, 32, 19","2, 32, 13","•","28, 2, 27","23, 28","35, 10, 18, 5","35, 33","24, 28, 35, 30","35, 13","11, 27, 32","28, 26, 10, 34","28, 26, 18, 23","2, 33","2","1, 26, 13","1, 12, 34, 3","1, 35, 13","27, 4, 1, 35","15, 24, 10","34, 27, 25","•","5, 12, 35, 26"],
        ["35, 26, 24, 37","28, 27, 15, 3","18, 4, 28, 38","30, 7, 14, 26","10, 26, 34, 31","10, 35, 17, 7","2, 6, 34, 10","35, 37, 10, 2","•","28, 15, 10, 36","10, 37, 14","14, 10, 34, 40","35, 3, 22, 39","29, 28, 10, 18","35, 10, 2, 18","20, 10, 16, 38","35, 21, 28, 10","26, 17, 19, 1","35, 10, 38, 19","1","35, 20, 10","28, 10, 29, 35","28, 10, 35, 23","13, 15, 23","•","35, 38","1, 35, 10, 38","1, 10, 34, 28","18, 10, 32, 1","22, 35, 13, 24","35, 22, 18, 39","35, 28, 2, 24","1, 28, 7, 10","1, 32, 10, 25","1, 35, 28, 37","12, 17, 28, 24","35, 18, 27, 2","5, 12, 35, 26","•"],
        ];
  
      // ------------------------------------------------------------
      // 4) Feature definitions for each of the 39 parameters
      // ------------------------------------------------------------
      const featureDefinitions = [
        "Weight of moving object: The mass of the object in a gravitational field. The force that the body exerts on its support or suspension.",
        "Weight of stationary object: The mass of the object in a gravitational field. The force that the body exerts on its support or suspension, or on the surface on which it rests.",
        "Length of moving object: Any linear dimension, not necessarily the longest one.",
        "Length of stationary object: Any linear dimension, not necessarily the longest one.",
        "Area of moving object: Characteristic part of a surface occupied by the object. Also, parameters such as texture.",
        "Area of stationary object: Characteristic part of a surface or cross-section occupied by the object.",
        "Volume of moving object: The cubic measure of space occupied by the object.",
        "Volume of stationary object: The cubic measure of space occupied by the object.",
        "Speed: Velocity, rate of a process or action in time.",
        "Force (Intensity): Force measures the interaction between systems. In Newtonian physics, force = mass × acceleration.",
        "Stress or pressure: Force per unit area, or tension.",
        "Shape: The external contours, appearance of a system.",
        "Stability of the object: The wholeness or integrity of the system; the relationship of the system's constituent elements.",
        "Strength: Extent to which the object is able to resist changing in response to force. Resistance to breaking.",
        "Durability of moving object: Time that the object can perform the action. Service life or useful life.",
        "Durability of non moving object: Time that the object can be in use. Service life or useful life.",
        "Temperature: The thermal condition of the object or system.",
        "Illumination intensity: Light flux per unit area, brightness, light quality, etc.",
        "Use of energy by moving object: Energy required to perform a particular action.",
        "Use of energy by stationary object: Energy required to perform a particular action.",
        "Power: The rate at which work is performed. The rate of use of energy.",
        "Loss of Energy: Energy that does not contribute to the job being done (reducing efficiency).",
        "Loss of substance: Partial or complete, permanent or temporary loss of a system's materials or parts.",
        "Loss of Information: Partial or complete, permanent or temporary, loss of data or access to data.",
        "Loss of Time: Time used approaching a critical value from the point of view of productivity.",
        "Quantity of substance/the matter: The amount of a system's materials, substances, parts, or subsystems.",
        "Reliability: A system's ability to perform its intended functions under stated conditions.",
        "Measurement accuracy: The closeness of the measured value to the actual value of a property.",
        "Manufacturing precision: Extent to which the actual characteristics match the specified or required characteristics.",
        "Object-affected harmful factors: Susceptibility of a system to externally generated harmful effects.",
        "Object-generated harmful factors: Harmful effects generated by a system on the environment or other systems.",
        "Ease of manufacture: The degree of facility or effortlessness in manufacturing the system.",
        "Ease of operation: Simplicity of using or operating the system.",
        "Ease of repair: Convenience, simplicity, and time to repair faults in a system.",
        "Adaptability or versatility: The extent to which a system/object can respond to changes or be used in multiple ways.",
        "Device complexity: The number and diversity of elements and interrelationships in a system.",
        "Difficulty of detecting and measuring: Complexity or costliness of measuring or monitoring the system.",
        "Extent of automation: The extent to which a system performs its functions without human intervention.",
        "Productivity: The number of functions or operations performed per unit time (output per unit time)."
      ];
  
      // ------------------------------------------------------------
      // A) Tooltip logic for MATRIX CELLS (show recommended principles, plus row/col features)
      // ------------------------------------------------------------
      function showTooltip(event, principleIds) {
        const tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = '';
  
        // Identify which cell was hovered
        const cell = event.target;
        const row = cell.parentElement.rowIndex;  // row index in the table
        const col = cell.cellIndex;              // column index in the table
  
        // The first row (row=0) is header row, and first column (col=0) is the corner cell, so:
        const worseningNumber = row;   // “worsening” is the row parameter
        const improvingNumber = col;   // “improving” is the column parameter
  
        // Safety checks (in case of headers, etc.)
        if (worseningNumber <= 0 || improvingNumber <= 0) {
          return; // we only want body cells, not the headers
        }
  
        // Map these to the actual parameter arrays (subtract 1 because arrays are 0-based)
        const worseningFeature = parameters[worseningNumber - 1];
        const improvingFeature = parameters[improvingNumber - 1];
  
        // ---- Populate the tooltip content ----
  
        // Worsening Feature
        const worseningTitle = document.createElement('strong');
        worseningTitle.textContent = `Worsening Feature (${worseningNumber}):`;
        tooltip.appendChild(worseningTitle);
  
        const worseningText = document.createElement('p');
        worseningText.textContent = worseningFeature;
        worseningText.style.margin = '5px 0 15px 0';
        tooltip.appendChild(worseningText);
  
        // Improving Feature
        const improvingTitle = document.createElement('strong');
        improvingTitle.textContent = `Improving Feature (${improvingNumber}):`;
        tooltip.appendChild(improvingTitle);
  
        const improvingText = document.createElement('p');
        improvingText.textContent = improvingFeature;
        improvingText.style.margin = '5px 0 15px 0';
        tooltip.appendChild(improvingText);
  
        // Recommended TRIZ Principles
        const principlesTitle = document.createElement('strong');
        principlesTitle.textContent = 'Recommended TRIZ Principles:';
        tooltip.appendChild(principlesTitle);
  
        const list = document.createElement('ul');
        principleIds.forEach(id => {
          const numId = parseInt(id.trim());
          if (!isNaN(numId) && numId >= 1 && numId <= 40) {
            const item = document.createElement('li');
            item.textContent = `${numId}: ${principlesList[numId - 1]}`;
            list.appendChild(item);
          }
        });
        tooltip.appendChild(list);
  
        // ---- Position the tooltip ----
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden'; // hide while we measure
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        tooltip.style.visibility = 'visible';
  
        // Basic logic to place tooltip on left/right/top/bottom depending on location
        const table = document.getElementById('trizMatrix');
        const tableRect = table.getBoundingClientRect();
        const tableMiddleX = tableRect.left + (tableRect.width / 2);
        const tableMiddleY = tableRect.top + (tableRect.height / 2);
  
        let leftPosition, topPosition;
  
        if (event.clientX < tableMiddleX) {
          // Left half => show tooltip to the right of cursor
          leftPosition = event.pageX + 10;
        } else {
          // Right half => show tooltip to the left
          leftPosition = event.pageX - tooltipWidth - 10;
        }
  
        if (event.clientY < tableMiddleY) {
          // Top half => show tooltip below cursor
          topPosition = event.pageY + 10;
        } else {
          // Bottom half => show tooltip above cursor
          topPosition = event.pageY - tooltipHeight - 10;
        }
  
        tooltip.style.left = leftPosition + 'px';
        tooltip.style.top = topPosition + 'px';
      }
  
      // ------------------------------------------------------------
      // B) Tooltip logic for HEADERS (show the feature definition)
      // ------------------------------------------------------------
      function showFeatureDefinition(event) {
        const tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = '';
  
        const header = event.target;
        let featureIndex = -1;
        let isColumnHeader = false;
  
        // Is it a row header? (td with class "feature-header")
        // or a column header? (th in the top row)
        if (header.classList.contains('feature-header')) {
          // It's a row header
          // rowIndex is the row in the table; row=0 is the top header row
          const row = header.parentElement.rowIndex;
          // row feature index = row - 1
          featureIndex = row - 1;
        }
        else if (header.tagName === 'TH' && header.cellIndex > 0) {
          // It's a column header
          featureIndex = header.cellIndex - 1;
          isColumnHeader = true;
        }
  
        // If invalid index, exit
        if (featureIndex < 0 || featureIndex >= parameters.length) {
          return;
        }
  
        // Build tooltip content
        const featureTitle = document.createElement('strong');
        featureTitle.textContent = `${featureIndex + 1}: ${parameters[featureIndex]}`;
        tooltip.appendChild(featureTitle);
  
        // The definitions array lines up with `parameters`
        if (featureDefinitions[featureIndex]) {
          const definitionText = document.createElement('p');
          // Everything after the colon in featureDefinitions
          const rawDef = featureDefinitions[featureIndex].split(': ');
          definitionText.textContent = rawDef[1] || featureDefinitions[featureIndex];
          definitionText.style.margin = '10px 0';
          tooltip.appendChild(definitionText);
        }
  
        // Show if it’s “worsening” (column) or “improving” (row)
        const typeLabel = document.createElement('div');
        typeLabel.textContent = isColumnHeader ? 'Worsening Feature' : 'Improving Feature';
        typeLabel.style.fontWeight = 'bold';
        typeLabel.style.marginTop = '10px';
        tooltip.appendChild(typeLabel);
  
        // Position the tooltip (simple approach)
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden';
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        tooltip.style.visibility = 'visible';
  
        let leftPosition, topPosition;
  
        if (isColumnHeader) {
          // Place below the header cell
          leftPosition = event.pageX - (tooltipWidth / 2);
          topPosition = event.pageY + 10;
        } else {
          // Place to the right for row headers
          leftPosition = event.pageX + 10;
          topPosition = event.pageY - (tooltipHeight / 2);
        }
  
        // Keep within window bounds
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
  
        if (leftPosition + tooltipWidth > windowWidth) {
          leftPosition = windowWidth - tooltipWidth - 10;
        }
        if (leftPosition < 0) {
          leftPosition = 10;
        }
        if (topPosition + tooltipHeight > windowHeight) {
          topPosition = windowHeight - tooltipHeight - 10;
        }
        if (topPosition < 0) {
          topPosition = 10;
        }
  
        tooltip.style.left = leftPosition + 'px';
        tooltip.style.top = topPosition + 'px';
      }
  
      // ------------------------------------------------------------
      // C) Common function to hide the tooltip
      // ------------------------------------------------------------
      function hideTooltip() {
        document.getElementById('tooltip').style.display = 'none';
      }
  
      // ------------------------------------------------------------
      // D) Add event listeners to row headers & column headers
      // ------------------------------------------------------------
      function addFeatureDefinitionListeners() {
        // Row headers
        const rowHeaders = document.querySelectorAll('.feature-header');
        rowHeaders.forEach(header => {
          header.addEventListener('mouseover', showFeatureDefinition);
          header.addEventListener('mouseout', hideTooltip);
          header.style.cursor = 'help';
        });
  
        // Column headers (top row THs after the corner cell)
        const columnHeaders = document.querySelectorAll('#trizMatrix th');
        columnHeaders.forEach(th => {
          // Skip the very first TH (corner cell)
          if (th.cellIndex > 0) {
            th.addEventListener('mouseover', showFeatureDefinition);
            th.addEventListener('mouseout', hideTooltip);
            th.style.cursor = 'help';
          }
        });
      }
  
      // ------------------------------------------------------------
      // E) Main function to generate the Contradiction Matrix table
      // ------------------------------------------------------------
      function generateMatrix() {
        const tableElement = document.getElementById('trizMatrix');
  
        // Clear if re-generated
        tableElement.innerHTML = '';
  
        // Create header row
        const headerRow = document.createElement('tr');
  
        // Create corner cell
        const cornerCell = document.createElement('th');
        cornerCell.textContent = 'Features';
        headerRow.appendChild(cornerCell);
  
        // Create column headers (1..39)
        for (let i = 1; i <= 39; i++) {
          const th = document.createElement('th');
          th.textContent = i;
          th.title = "";
          headerRow.appendChild(th);
        }
        tableElement.appendChild(headerRow);
  
        // Create rows for each parameter
        for (let i = 0; i < parameters.length; i++) {
          const row = document.createElement('tr');
  
          // Row header cell
          const rowHeader = document.createElement('td');
          rowHeader.className = 'feature-header';
          rowHeader.title = "";
          rowHeader.textContent = `${i + 1}: ${parameters[i]}`;
          row.appendChild(rowHeader);
  
          // Now the 39 matrix cells in this row
          for (let j = 0; j < 39; j++) {
            const cell = document.createElement('td');
  
            if (i < matrixData.length && j < matrixData[i].length) {
              const cellValue = matrixData[i][j];
              cell.textContent = cellValue;
  
              // If not a filler cell "•", attach mouseover for TRIZ principles
              if (cellValue !== "•") {
                cell.style.cursor = 'pointer';
                // Store the principle indices in an attribute so we can parse them in showTooltip
                cell.setAttribute('data-principles', cellValue);
  
                cell.addEventListener('mouseover', function(e) {
                  // Split the string at commas
                  const principles = this.getAttribute('data-principles').split(',');
                  showTooltip(e, principles);
                });
  
                cell.addEventListener('mouseout', hideTooltip);
              }
            } else {
              cell.textContent = "•";
            }
            row.appendChild(cell);
          }
          tableElement.appendChild(row);
        }
  
        // Attach definition listeners for row & column headers
        addFeatureDefinitionListeners();
      }
  
      // ------------------------------------------------------------
      // F) Trigger everything when the page loads
      // ------------------------------------------------------------
      window.onload = function() {
        generateMatrix();
      };