/**
 * @fileoverview Type definitions for OVWTN models
 * Using JSDoc for type safety in JavaScript
 */

/**
 * @typedef {Object} MembershipTier
 * @property {number} id
 * @property {string} name - Tier name (Registering Interest, Basic, Full, Associate)
 * @property {string} slug - URL-friendly slug
 * @property {string|null} description
 * @property {number} annual_fee - Annual fee in KES
 * @property {number} registration_fee - One-time registration fee in KES
 * @property {number|null} duration_months - Duration in months, null for no expiry
 * @property {boolean} has_voting_rights
 * @property {boolean} is_public_directory - Show in public directory
 * @property {boolean} can_post_listings
 * @property {boolean} can_access_resources
 * @property {boolean} can_register_events
 * @property {number} display_order
 * @property {boolean} is_active
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} role - 'admin' or 'member'
 * @property {string|null} first_name
 * @property {string|null} last_name
 * @property {string|null} phone_number
 * @property {boolean} is_active
 * @property {boolean} is_verified
 * @property {boolean} email_verified
 * @property {number|null} organisation_id
 * @property {Organisation|null} organisation
 * @property {boolean} first_login
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 * @property {string|null} last_login - ISO date string
 */

/**
 * @typedef {Object} Organisation
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} physical_address
 * @property {string|null} postal_address
 * @property {string|null} county
 * @property {string|null} phone_number
 * @property {string|null} email
 * @property {string|null} website
 * @property {string[]|null} sectors - Array of sector names
 * @property {string[]|null} counties_of_operation
 * @property {string|null} registration_type - LLC, CLG, LLP, SACCO, NGO, Other
 * @property {string|null} registration_type_other
 * @property {string|null} registration_number
 * @property {string|null} registration_date - ISO date string
 * @property {string|null} short_description
 * @property {string|null} full_description
 * @property {number|null} total_members
 * @property {string|null} representative_name
 * @property {string|null} representative_designation
 * @property {string|null} representative_email
 * @property {string|null} representative_phone
 * @property {string|null} chairperson_name
 * @property {string|null} vice_chair_name
 * @property {string|null} ceo_name
 * @property {string|null} logo_url
 * @property {number|null} membership_tier_id
 * @property {MembershipTier|null} membership_tier
 * @property {string} membership_status - pending, active, expired, suspended
 * @property {string|null} membership_start_date - ISO date string
 * @property {string|null} membership_expiry_date - ISO date string
 * @property {boolean} registration_fee_paid
 * @property {string|null} registration_fee_payment_date - ISO date string
 * @property {boolean} is_public_visible
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 */

/**
 * @typedef {Object} MembershipApplication
 * @property {number} id
 * @property {string} application_number
 * @property {string} status - pending, approved, rejected
 * @property {string} applicant_email
 * @property {string} organisation_name
 * @property {string|null} physical_address
 * @property {string|null} postal_address
 * @property {string|null} county
 * @property {string|null} phone_number
 * @property {string|null} email_address
 * @property {string|null} website
 * @property {string[]|null} sectors
 * @property {string[]|null} counties_of_operation
 * @property {string} membership_type - full, basic, associate, registering_interest
 * @property {boolean|null} is_association
 * @property {boolean|null} is_registered
 * @property {boolean|null} represents_women_in_trade
 * @property {string|null} registration_type
 * @property {string|null} registration_type_other
 * @property {string|null} organisation_description
 * @property {number|null} total_members
 * @property {string|null} registration_number
 * @property {string|null} registration_date - ISO date string
 * @property {string|null} registration_certificate_path
 * @property {string|null} kra_pin_document_path
 * @property {string|null} representative_name
 * @property {string|null} representative_designation
 * @property {string|null} representative_email
 * @property {string|null} representative_phone
 * @property {string|null} chairperson_name
 * @property {string|null} vice_chair_name
 * @property {string|null} ceo_name
 * @property {boolean|null} register_interest
 * @property {string|null} payment_mode - mpesa, cheque
 * @property {string|null} payment_reference
 * @property {string|null} trade_barriers
 * @property {string|null} advocacy_messages
 * @property {string|null} association_needs
 * @property {string|null} expected_benefits
 * @property {string[]|null} contributions
 * @property {string|null} contributions_other
 * @property {string[]|null} referral_source
 * @property {string|null} referral_source_other
 * @property {boolean} data_consent
 * @property {number|null} reviewed_by_id
 * @property {string|null} reviewed_at - ISO date string
 * @property {string|null} rejection_reason
 * @property {string|null} rejection_notes
 * @property {string|null} admin_notes
 * @property {number|null} organisation_id
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 * @property {string|null} submitted_at - ISO date string
 */

/**
 * @typedef {Object} PaymentProof
 * @property {number} id
 * @property {string} reference_number
 * @property {string} payment_type - mpesa, cheque
 * @property {string} payment_reference - M-Pesa code or cheque number
 * @property {number} amount
 * @property {string} payment_purpose - registration_fee, annual_fee, upgrade
 * @property {string} verification_status - pending, verified, rejected
 * @property {string|null} verification_notes
 * @property {number|null} verified_by_id
 * @property {string|null} verified_at - ISO date string
 * @property {number|null} organisation_id
 * @property {number|null} application_id
 * @property {string} submitted_by_email
 * @property {string|null} submitted_by_name
 * @property {boolean} receipt_generated
 * @property {string|null} receipt_number
 * @property {string|null} receipt_path
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 * @property {string|null} payment_date - ISO date string
 */

/**
 * @typedef {Object} ApiResponse
 * @template T
 * @property {boolean} success
 * @property {T} data
 * @property {string|null} message
 * @property {Object|null} error
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {string|null} icon
 * @property {string|null} color
 * @property {number} display_order
 * @property {boolean} is_active
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 */

/**
 * @typedef {Object} Listing
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {string|null} short_summary
 * @property {string} full_description
 * @property {number} category_id
 * @property {Category|null} category
 * @property {string[]|null} photos - Array of photo URLs
 * @property {string[]|null} documents - Array of document paths
 * @property {string} price_type - exact, range, on_request
 * @property {number|null} price_min
 * @property {number|null} price_max
 * @property {string} currency
 * @property {string|null} unit_of_sale
 * @property {string|null} whatsapp_phone
 * @property {string|null} contact_email
 * @property {string|null} contact_phone
 * @property {string} visibility - public, members_only, paid_tier_only
 * @property {boolean} is_active
 * @property {boolean} is_featured
 * @property {string|null} meta_description
 * @property {number} organisation_id
 * @property {Organisation|null} organisation
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 * @property {string|null} published_at - ISO date string
 */

/**
 * @typedef {Object} DocumentResource
 * @property {number} id
 * @property {string} title
 * @property {string|null} description
 * @property {string} file_name
 * @property {string} file_path
 * @property {number|null} file_size - Size in bytes
 * @property {string|null} file_type - MIME type
 * @property {string} visibility - public, member_only
 * @property {string|null} category
 * @property {string|null} tags
 * @property {number} uploaded_by_id
 * @property {User|null} uploaded_by
 * @property {boolean} is_active
 * @property {number} download_count
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 */

/**
 * @typedef {Object} Event
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {string} description
 * @property {string} start_date - ISO date string
 * @property {string|null} end_date - ISO date string
 * @property {string|null} location
 * @property {boolean} is_online
 * @property {string|null} online_link
 * @property {number|null} registration_capacity
 * @property {string|null} registration_deadline - ISO date string
 * @property {boolean} allow_registration
 * @property {boolean} is_active
 * @property {boolean} is_published
 * @property {number} created_by_id
 * @property {User|null} created_by
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 * @property {number} registrations_count
 */

/**
 * @typedef {Object} EventRegistration
 * @property {number} id
 * @property {number} event_id
 * @property {Event|null} event
 * @property {number|null} organisation_id
 * @property {Organisation|null} organisation
 * @property {number|null} user_id
 * @property {User|null} user
 * @property {string} registrant_name
 * @property {string} registrant_email
 * @property {string|null} registrant_phone
 * @property {boolean|null} attended
 * @property {string|null} attendance_marked_at - ISO date string
 * @property {string} status - registered, cancelled, attended
 * @property {string|null} registration_notes
 * @property {string|null} admin_notes
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 */

/**
 * @typedef {Object} AuditLog
 * @property {number} id
 * @property {string} action
 * @property {string} entity_type
 * @property {number|null} entity_id
 * @property {number} user_id
 * @property {User|null} user
 * @property {string|null} description
 * @property {Object|null} changes - Before/after values
 * @property {string|null} ip_address
 * @property {string|null} user_agent
 * @property {string} created_at - ISO date string
 */

/**
 * @typedef {Object} AIInteractionLog
 * @property {number} id
 * @property {string} session_id
 * @property {number|null} user_id
 * @property {User|null} user
 * @property {Array<{role: string, content: string, timestamp: string}>} messages
 * @property {string|null} conversation_summary
 * @property {boolean} handover_triggered
 * @property {string|null} handover_reason
 * @property {string|null} handover_timestamp - ISO date string
 * @property {string|null} handover_message
 * @property {string|null} visitor_name
 * @property {string|null} visitor_email
 * @property {string|null} visitor_phone
 * @property {string|null} ip_address
 * @property {string|null} user_agent
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 * @property {string|null} ended_at - ISO date string
 */

/**
 * @typedef {Object} PaginatedResponse
 * @template T
 * @property {T[]} items
 * @property {number} total
 * @property {number} page
 * @property {number} size
 * @property {number} pages
 */

export {};
