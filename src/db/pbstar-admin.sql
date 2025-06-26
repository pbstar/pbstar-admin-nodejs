/*
 Navicat Premium Dump SQL

 Source Server         : pbstar-admin
 Source Server Type    : MySQL
 Source Server Version : 80036 (8.0.36)
 Source Host           : 152.136.96.92:3306
 Source Schema         : pbstar-admin

 Target Server Type    : MySQL
 Target Server Version : 80036 (8.0.36)
 File Encoding         : 65001

 Date: 26/06/2025 11:40:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for enum_items
-- ----------------------------
DROP TABLE IF EXISTS `enum_items`;
CREATE TABLE `enum_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `enum_id` int NOT NULL,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enum_items
-- ----------------------------
INSERT INTO `enum_items` VALUES (1, 1, '是', '1', '2025-06-17 17:20:08', '2025-06-17 21:41:23');
INSERT INTO `enum_items` VALUES (2, 1, '否', '2', '2025-06-17 17:20:22', '2025-06-17 21:41:25');
INSERT INTO `enum_items` VALUES (3, 2, '男', '1', '2025-06-17 17:23:02', '2025-06-17 21:41:26');
INSERT INTO `enum_items` VALUES (4, 2, '女', '2', '2025-06-17 17:23:11', '2025-06-17 21:41:28');
INSERT INTO `enum_items` VALUES (5, 3, '汉族', '1', '2025-06-17 17:23:27', '2025-06-17 21:41:31');
INSERT INTO `enum_items` VALUES (6, 3, '满族', '2', '2025-06-17 17:23:43', '2025-06-17 21:41:33');
INSERT INTO `enum_items` VALUES (7, 3, '回族', '3', '2025-06-17 21:39:06', '2025-06-17 21:41:36');
INSERT INTO `enum_items` VALUES (8, 3, '苗族', '4', '2025-06-17 21:39:20', '2025-06-17 21:41:40');

-- ----------------------------
-- Table structure for enums
-- ----------------------------
DROP TABLE IF EXISTS `enums`;
CREATE TABLE `enums`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `enum_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `enum_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enums
-- ----------------------------
INSERT INTO `enums` VALUES (1, '布尔值', 'boolean', NULL, '2025-06-17 17:03:34', '2025-06-17 17:03:34');
INSERT INTO `enums` VALUES (2, '性别', 'sex', NULL, '2025-06-17 17:10:12', '2025-06-17 17:10:12');
INSERT INTO `enums` VALUES (3, '民族', 'ethnic', NULL, '2025-06-17 17:10:33', '2025-06-17 17:10:33');

-- ----------------------------
-- Table structure for example_person_edus
-- ----------------------------
DROP TABLE IF EXISTS `example_person_edus`;
CREATE TABLE `example_person_edus`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `person_id` int NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `date_start` date NULL DEFAULT NULL,
  `date_end` date NULL DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of example_person_edus
-- ----------------------------
INSERT INTO `example_person_edus` VALUES (1, 1, '本科', '2018-09-01', '2022-06-30', NULL, '2025-06-17 22:36:41', '2025-06-17 22:36:41');

-- ----------------------------
-- Table structure for example_persons
-- ----------------------------
DROP TABLE IF EXISTS `example_persons`;
CREATE TABLE `example_persons`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `age` int NULL DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ethnic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `is_healthy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `hobby_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of example_persons
-- ----------------------------
INSERT INTO `example_persons` VALUES (1, '张小艺', 22, '2', '1', '1', NULL, '2025-06-17 22:33:43', '2025-06-17 22:33:43');
INSERT INTO `example_persons` VALUES (2, '穆成文', 28, '1', '2', '1', NULL, '2025-06-17 22:38:25', '2025-06-17 22:38:25');
INSERT INTO `example_persons` VALUES (3, '徐程', 27, '1', '3', '2', NULL, '2025-06-17 22:39:04', '2025-06-17 22:39:04');
INSERT INTO `example_persons` VALUES (6, '张小艺', 22, '2', '1', NULL, '[{\"hobby\":\"唱歌\",\"remark\":\"唱\"}]', '2025-06-24 14:32:08', '2025-06-24 14:32:08');
INSERT INTO `example_persons` VALUES (7, '张小艺11', 22, '2', '1', NULL, '[{\"hobby\":\"234\"}]', '2025-06-24 14:32:20', '2025-06-24 14:45:38');
INSERT INTO `example_persons` VALUES (14, '张小艺', 22, '2', '1', NULL, '[{\"hobby\":\"唱歌\",\"remark\":\"唱\"}]', '2025-06-24 16:19:38', '2025-06-24 16:19:38');

-- ----------------------------
-- Table structure for navs
-- ----------------------------
DROP TABLE IF EXISTS `navs`;
CREATE TABLE `navs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `parent_id` int NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of navs
-- ----------------------------
INSERT INTO `navs` VALUES (1, '首页', NULL, '/admin/pHome', 'HomeFilled', NULL, '2025-06-17 21:30:16', '2025-06-17 21:30:16');
INSERT INTO `navs` VALUES (2, '示例应用', NULL, NULL, 'Menu', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (3, '列表', 2, '/admin/example?example=%2Flist', '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (4, '系统应用', NULL, NULL, 'Tools', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (5, '用户管理', 4, '/admin/system?system=%2Fuser', '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (6, '角色管理', 4, '/admin/system?system=%2Frole', '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (7, '菜单管理', 4, '/admin/systemsystem?=%2Fnav', '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (8, '枚举管理', 4, '/admin/system?system=%2Fenum', '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (9, '代码生成器', 4, '/admin/system?system=%2Fgenerator', '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (10, 'Echarts示例', 2, '/admin/example?example=%2Fecharts', '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (11, '编辑器', 2, NULL, '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (12, 'Markdown编辑器', 11, '/admin/example?example=%2FeditorMd', '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (13, '富文本编辑器', 11, '/admin/example?example=%2FeditorRt', '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');
INSERT INTO `navs` VALUES (14, '大屏可视化', 2, '/admin/example?example=%2FbigScreen', '', '', '2025-06-17 21:36:56', '2025-06-17 21:36:56');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `navs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `btns` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, '超级管理员', 'admin', 'all', 'all', NULL, '2025-06-17 22:01:59', '2025-06-17 22:01:59');
INSERT INTO `roles` VALUES (2, '管理员', 'common', '1,3,7,8,9,10', 'list_add,list_view', NULL, '2025-06-17 22:03:13', '2025-06-17 22:03:13');
INSERT INTO `roles` VALUES (3, '用户', 'user', '1,3,9,10', NULL, NULL, '2025-06-17 22:03:50', '2025-06-17 22:03:50');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '超级管理员', 'https://p9-passport.byteacctimg.com/img/user-avatar/20aafa059387952c765dbfdd421298ed~80x80.awebp', 'admin', '123456', 'admin', 'MXwxNzUwNTcwNjY0NTcx', '2025-06-17 21:48:03', '2025-06-22 13:37:44');
INSERT INTO `users` VALUES (2, '管理员', NULL, 'common', '123456', 'common', NULL, '2025-06-17 21:48:57', '2025-06-17 21:48:57');
INSERT INTO `users` VALUES (3, '用户', NULL, 'user', '123456', 'user', 'M3wxNzUwNDkzODk3OTY0', '2025-06-17 21:49:29', '2025-06-21 16:18:17');

SET FOREIGN_KEY_CHECKS = 1;
