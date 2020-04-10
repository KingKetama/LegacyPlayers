use crate::modules::live_data_processor::tools::payload_mapper::MapMessageType;
use crate::modules::live_data_processor::dto::MessageType;

#[test]
fn test_map_message_type_positive() {
  // Arrange
  let payload = vec![
    1, 234, 0, 0, 0, 0, 0, 0, 0, // Attacker
    1, 255, 0, 0, 0, 0, 0, 0, 0, // Victim
    111, 0, 0, 0, // SpellId
    32, 0, 0, 0, // Blocked
    4, // School
    42, 0, 0, 0, // Damage
    10, 0, 0, 0, // Resisted or glanced
    12, 0, 0, 0 // Absorbed
  ];
  let message_type_number: u8 = 1;

  // Act
  let message_type = message_type_number.to_message_type(&payload);

  // Assert
  assert!(message_type.is_ok());
  let message_type = message_type.unwrap();
  assert!(match message_type {
    MessageType::SpellDamage(_) => true,
    _ => false
  });
}

#[test]
fn test_map_message_type_negative() {
  // Arrange
  let payload = vec![];
  let message_type_number = 255;

  // Act
  let message_type = message_type_number.to_message_type(&payload);

  // Assert
  assert!(message_type.is_err());
}