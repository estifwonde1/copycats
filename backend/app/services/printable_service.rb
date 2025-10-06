class PrintableService
  def hub_authorization(id)
    item = Cats::Core::DispatchPlanItem.includes(
      :dispatch_plan,
      :source,
      :destination,
      :unit,
      { commodity: { project: :source } }
    ).find(id)
    commodity_source = item.commodity.project.source
    donor = commodity_source.respond_to?('donor') ? commodity_source.donor.name : nil
    {
      date: Date.today,
      requisition_no: item.dispatch_plan.reference_no,
      reference_no: item.reference_no,
      source: item.source.name,
      destination: item.destination.name,
      commodity_source: commodity_source.description,
      donor: donor,
      commodities: [
        {
          s_no: 1,
          name: commodity_source.commodity_name,
          batch_no: item.commodity.batch_no,
          quantity: item.quantity,
          unit: item.unit.abbreviation,
          vessel_name: item.commodity.shipping_reference
        }
      ]
    }
  end

  def issue_receipt(id, user)
    authorization = Cats::Core::DispatchAuthorization.includes(
      { dispatch: [:transporter, { dispatch_plan_item: %i[source destination dispatch_plan commodity] }] },
      :store
    ).find(id)

    destination = authorization.dispatch.dispatch_plan_item.destination
    fdp = destination.location_type == Cats::Core::Location::FDP ? destination : nil
    woreda = destination.location_type == Cats::Core::Location::WOREDA ? destination : destination.parent
    {
      date: Date.today,
      plan_reference: authorization.dispatch.dispatch_plan_item.dispatch_plan.dispatchable.reference_no,
      authorization_no: authorization.dispatch.dispatch_plan_item.reference_no,
      source: authorization.dispatch.dispatch_plan_item.source.name,
      store: authorization.store.code,
      region: woreda.parent.parent.name,
      zone: woreda.parent.name,
      woreda: woreda.name,
      fdp: fdp&.name,
      transporter: authorization.dispatch.transporter.name,
      plate_no: authorization.dispatch.plate_no,
      prepared_by: user.full_name,
      driver_name: authorization.dispatch.driver_name,
      commodities: [
        {
          s_no: 1,
          name: authorization.dispatch.dispatch_plan_item.commodity.name,
          batch_no: authorization.dispatch.dispatch_plan_item.commodity.batch_no,
          quantity: authorization.quantity,
          unit: authorization.dispatch.unit.abbreviation
        }
      ]
    }
  end

  def receiving_receipt(id, user)
    authorization = Cats::Core::ReceiptAuthorization.includes(
      {
        dispatch: [
          :transporter,
          {
            dispatch_plan_item: [
              :source,
              :destination,
              :dispatch_plan,
              {
                commodity: { project: :source }
              }
            ]
          }
        ]
      },
      :store
    ).find(id)

    commodity_source = authorization.dispatch.dispatch_plan_item.commodity.project.source
    po_reference = commodity_source.instance_of?(Cats::Core::PurchaseOrder) ? commodity_source.reference_no : nil
    commodity_grade = authorization.receipts.first&.commodity_grade
    donor = commodity_source.respond_to?('donor') ? commodity_source.donor.name : nil
    {
      date: Date.today,
      donor: donor,
      transporter: authorization.dispatch.transporter.name,
      dispatch_reference_no: authorization.dispatch.reference_no,
      destination: authorization.dispatch.dispatch_plan_item.destination.name,
      store: authorization.store.code,
      po_reference_no: po_reference,
      commodity_grade: commodity_grade,
      prepared_by: user.full_name,
      driver_name: authorization.dispatch.driver_name,
      commodities: [
        {
          s_no: 1,
          name: authorization.dispatch.dispatch_plan_item.commodity.name,
          batch_no: authorization.dispatch.dispatch_plan_item.commodity.batch_no,
          quantity: authorization.quantity,
          received_quantity: authorization.received_quantity,
          unit: authorization.dispatch.unit.abbreviation
        }
      ]
    }
  end
end
